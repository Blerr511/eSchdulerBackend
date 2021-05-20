import * as admin from 'firebase-admin';
import * as nodeSchedule from 'node-schedule';
import {Database} from 'helpers/DatabaseController';
import {ISchedule, ScheduleController} from 'helpers/DatabaseController/ScheduleController';
import {Messaging} from 'helpers/Messaging/Messaging.helper';
import {getScheduleCroneTime} from 'helpers/util';

export class Scheduler {
	private static get scheduleModel(): ScheduleController {
		return new Database().schedule;
	}
	private static handleSchedule = (ds: admin.database.DataSnapshot): void => {
		const schedule = ds.val() as ISchedule;
		console.log('scheduling on ', getScheduleCroneTime(schedule));
		nodeSchedule.scheduleJob(schedule.uid, getScheduleCroneTime(schedule), async () => {
			await Messaging.notifyStudent(schedule);
			await Messaging.notifyLecturer(schedule);
			if (schedule.singleTime) await Scheduler.scheduleModel.deleteById(schedule.uid);
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
