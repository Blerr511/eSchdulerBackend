import {DBItem} from 'helpers/DatabaseController/data.types';

export type Role = 'student' | 'lecturer';

export interface IUserPayload {
	role: Role;
}

export interface IUser extends DBItem, IUserPayload {}
