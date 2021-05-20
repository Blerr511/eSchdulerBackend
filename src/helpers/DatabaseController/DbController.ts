import * as admin from 'firebase-admin';
import {Users} from './users';
import {ScheduleController} from './ScheduleController';
import {Lesson} from './lesson';

export class Database {
	private db = admin.database();
	public get users(): Users {
		return new Users(this.db);
	}
	public get lesson(): Lesson {
		return new Lesson(this.db);
	}
	public get schedule(): ScheduleController {
		return new ScheduleController(this.db);
	}
}
