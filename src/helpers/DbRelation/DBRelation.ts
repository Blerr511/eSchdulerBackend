import * as admin from 'firebase-admin';
import {DatabaseController, IDBElement} from 'helpers/DatabaseController';

export class Relation<M extends IDBElement = IDBElement, R extends IDBElement = IDBElement> {
	private db = admin.database();
	private _mainClass: DatabaseController<M, M>;

	public get mainClass(): DatabaseController<M, M> {
		return this._mainClass;
	}

	public set mainClass(value: DatabaseController<M, M>) {
		this._mainClass = value;
	}

	private relationClass: DatabaseController<R, R>;
	_ref: string;
	constructor(mainClass: DatabaseController<M, M>, relationClass: DatabaseController<R, R>) {
		this._mainClass = mainClass;
		this.relationClass = relationClass;
		this._ref = `${mainClass._ref}->${relationClass._ref}`;
	}
	private getRef(...nested: string[]) {
		const refStr = nested.reduce((acc, v) => `${acc}/${v}`, this._ref);
		const ref = this.db.ref(refStr);
		return ref;
	}
	public async create(uid: string, uids: string[]): Promise<unknown> {
		const $ref = this.getRef(uid);
		const data = uids.reduce((acc, v) => ({...acc, [v]: v}), {});
		return await $ref.set(data);
	}
	public async update(uid: string, uids: string[]): Promise<unknown> {
		const $ref = this.getRef(uid);
		const ref = await $ref.get();
		if (!ref.exists()) throw new Error(`Ref wih id ${uid} not found.`);
		const data = uids.reduce((acc, v) => ({...acc, [v]: v}), {});
		return await $ref.update(data);
	}

	public async get(uid: string): Promise<R[]> {
		const $ref = this.getRef(uid);
		const ref = await $ref.get();
		if (!ref.exists()) throw new Error(`Ref wih id ${uid} not found.`);

		const ids: string[] = [];

		ref.forEach(id => {
			const d = id.toJSON() as string;
			ids.push(d);
		});

		const response: R[] = [];

		for (let i = 0; i < ids.length; i++) {
			const id = ids[i];

			try {
				const result = await this.relationClass.findById(id);
				response.push(result);
			} catch (error) {
				this.remove(uid, id).catch();
			}
		}

		return response;
	}

	public async remove(uid: string, relUid: string): Promise<void> {
		const $ref = this.getRef(uid, relUid);
		const ref = await $ref.get();
		if (!ref.exists()) throw new Error(`Ref wih id ${relUid} not found.`);
		await $ref.remove();
	}
}
