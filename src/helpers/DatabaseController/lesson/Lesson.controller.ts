import {BaseController} from '../BaseController.abstract';
import {ILesson} from '../data.types';

export class Lesson extends BaseController<ILesson> {
	public _ref = 'lesson';
}
