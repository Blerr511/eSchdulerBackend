import * as admin from 'firebase-admin';
import {DBItem} from './data.types';
import * as uuid from 'uuid';

export type DBItemPayload<T extends DBItem> = Omit<T, keyof DBItem> & Partial<DBItem>;

export abstract class Controller {
	public abstract _ref: string;
	protected db: admin.database.Database;
	constructor(db: admin.database.Database) {
		this.db = db;
	}
	protected getRef(...nested: string[]): admin.database.Reference {
		const refStr = nested.filter(Boolean).reduce((acc, v) => `${acc}/${v}`, this._ref);
		const ref = this.db.ref(refStr);
		return ref;
	}
}

export abstract class BaseController<T extends DBItem = DBItem> extends Controller {
	public async findById(userId: string): Promise<T> {
		const $ref = this.getRef(userId);

		const snap: admin.database.DataSnapshot = await new Promise((res, rej) =>
			$ref.once('value', res, rej)
		);
		const value: T | null = snap.val();
		if (!value) throw new Error('Data not found');
		return value;
	}

	public pipeById(userId: string, cb: (user: T | null) => void): () => void {
		const $ref = this.getRef(userId);

		const handleValue = (snap: admin.database.DataSnapshot) => {
			cb(snap.val() as T);
		};

		$ref.on('value', handleValue);

		return () => $ref.off('value', handleValue);
	}

	public async find(filter?: (user: T) => boolean): Promise<T[]> {
		const res: T[] = [];
		const $ref = this.getRef();

		const snap: admin.database.DataSnapshot = await new Promise((res, rej) =>
			$ref.once('value', res, rej)
		);

		snap.forEach(el => {
			const val = el.val() as T;
			if (!filter || filter(val)) res.push(val);
			return undefined;
		});

		return res;
	}

	public pipe(cb: (users: T[]) => void, filter?: (user: T) => boolean): () => void {
		const $ref = this.getRef();

		const handleValue = (snap: admin.database.DataSnapshot) => {
			const res: T[] = [];
			snap.forEach(u => {
				const val = u.val() as T;
				if (!filter || filter(val)) res.push(val);
				return undefined;
			});

			cb(res);
		};

		$ref.on('value', handleValue);

		return () => $ref.off('value', handleValue);
	}

	public async create(user: DBItemPayload<T>): Promise<T> {
		const uid = user.uid || uuid.v4().toString();
		const $ref = this.getRef(uid);
		await $ref.set({...user, uid, createdAt: Date.now()});
		return this.findById(uid);
	}

	public async deleteById(uid: DBItem['uid']): Promise<void> {
		const $ref = this.getRef(uid);
		await $ref.remove();
	}

	public ref(...rest: string[]): admin.database.Reference {
		return this.getRef(...rest);
	}
}
