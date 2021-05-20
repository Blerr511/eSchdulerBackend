import {Database} from 'helpers/DatabaseController';
import {ISchedule} from 'helpers/DatabaseController/ScheduleController';
import {messaging} from 'firebase-admin';

export class Messaging {
	static async notifyStudent({
		groupId,
		lecturerId,
		lessonId,
		time,
		isExam,
		link
	}: ISchedule): Promise<void> {
		const lessonController = new Database().lesson;
		const lecturerController = new Database().users;

		const lesson = await lessonController.findById(lessonId);

		const lecturer = await lecturerController.findById(lecturerId);

		await messaging().sendToTopic(groupId, {
			notification: {
				title: `Your ${isExam ? 'exam' : 'lesson'} will start in ${time} PM`,
				body: `${lesson.title}\n${lesson.description || ''}\n${
					lecturer.displayName || lecturer.email
				}`
			},
			data: {
				linking: link || '',
				okText: link ? 'Open' : 'Ok'
			}
		});
	}
	static async notifyLecturer({lecturerId, lessonId, time, isExam, link}: ISchedule): Promise<void> {
		const lessonController = new Database().lesson;
		const lecturerController = new Database().users;

		const lesson = await lessonController.findById(lessonId);

		const lecturer = await lecturerController.findById(lecturerId);

		await messaging().sendToTopic(lecturerId, {
			notification: {
				title: `Your ${isExam ? 'exam' : 'lesson'} will start in ${time} PM`,
				body: `${lesson.title}\n${lesson.description || ''}\n${
					lecturer.displayName || lecturer.email
				}`
			},
			data: {
				linking: link || '',
				okText: link ? 'Open' : 'Ok'
			}
		});
	}
}
