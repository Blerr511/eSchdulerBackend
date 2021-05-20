import {BaseController} from '../BaseController.abstract';
import {DBItem, IGroup, ILesson, IUser} from '../data.types';

export interface ISchedule<S extends boolean = boolean> extends DBItem {
	lecturerId: IUser<'lecturer'>['uid'];
	lessonId: ILesson['uid'];
	groupId: IGroup['uid'];
	singleTime: S;
	date: S extends true ? number : undefined;
	time: string;
	weekDays: S extends false ? number[] : undefined;
	link?: string;
	description?: string;
	isExam?: boolean;
}

export class ScheduleController extends BaseController<ISchedule> {
	public _ref = 'schedule';
}
