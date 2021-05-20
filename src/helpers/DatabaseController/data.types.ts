export interface DBItem {
	uid: string;
	createdAt: number;
}
export type IRole = 'student' | 'lecturer' | 'admin';

export interface IFaculty extends DBItem {
	title: string;
	longTitle: string;
}

export interface IStudentSettings {
	facultyId: IFaculty['uid'];
	groupId: IGroup['uid'];
	pushNotifications: boolean;
}

export interface IUser<R extends IRole = IRole> extends DBItem {
	email: string;
	name?: string | null;
	role: R;
	displayName?: string;
	settings?: R extends 'student' ? IStudentSettings : null;
}

export interface IGroup extends DBItem {
	facultyId: IFaculty['uid'];
	title: string;
}

export interface ILesson extends DBItem {
	title: string;
	description?: string;
	uri?: string;
	lecturerId: string;
	groupId: string;
}
