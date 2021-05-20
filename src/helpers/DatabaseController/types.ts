export interface IDBElement {
	uid: string;
}

export interface DatabaseController<P = unknown, T extends IDBElement = IDBElement> {
	create: (data: P) => Promise<unknown>;
	updateById: (uid: string, data: Partial<P>) => Promise<unknown>;
	findById: (uid: string) => Promise<T>;
	find: (resolver?: (data: T) => boolean) => Promise<T[]>;
	removeById: (uid: string) => Promise<void>;
	_ref: string;
}
