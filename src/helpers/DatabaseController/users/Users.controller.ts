import {BaseController} from '../BaseController.abstract';
import {IUser} from '../data.types';

export class Users extends BaseController<IUser> {
	public _ref = 'users';
}
