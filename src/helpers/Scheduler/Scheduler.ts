import * as admin from 'firebase-admin';
import * as nodeSchedule from 'node-schedule';
import {Database} from 'helpers/DatabaseController';
import {ISchedule, ScheduleController} from 'helpers/DatabaseController/ScheduleController';
import {Messaging} from 'helpers/Messaging/Messaging.helper';
import {getScheduleCroneTime} from 'helpers/util';
import moment from 'moment';

export class Scheduler {
	private static get scheduleModel(): ScheduleController {
		return new Database().schedule;
	}
	private static handleSchedule = (ds: admin.database.DataSnapshot): void => {
		const schedule = ds.val() as ISchedule;
		if (schedule.singleTime) {
			const hour = Number(schedule.time.split(':')[0]);
			const minute = Number(schedule.time.split(':')[1]);
			const triggerTime = moment.unix(schedule.date / 1000).set({hour, minute});
			if (triggerTime.isSameOrBefore(moment())) {
				Scheduler.scheduleModel.deleteById(schedule.uid);
				return;
			}
		}
		nodeSchedule.scheduleJob(schedule.uid, getScheduleCroneTime(schedule), async () => {
			await Messaging.notifyStudent(schedule);
			await Messaging.notifyLecturer(schedule);
			if (schedule.singleTime) {
				const date = moment().add({hour: schedule?.isExam ? 9 : 2});
				nodeSchedule.scheduleJob(schedule.uid, date.toDate(), async () => {
					await Scheduler.scheduleModel.deleteById(schedule.uid);
				});
			}
		});
	};

	private static handleRemoveSchedule = (ds: admin.database.DataSnapshot) => {
		const schedule = ds.val() as ISchedule;
		nodeSchedule.cancelJob(schedule.uid);
	};

	public static init(): void {
		this.scheduleModel.ref().on('child_added', this.handleSchedule);

		this.scheduleModel.ref().on('child_removed', this.handleRemoveSchedule);

		this.scheduleModel.ref().on('child_changed', ds => {
			this.handleRemoveSchedule(ds);
			this.handleSchedule(ds);
		});
	}
}
