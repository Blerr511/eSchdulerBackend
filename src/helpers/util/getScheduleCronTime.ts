import {ISchedule} from 'helpers/DatabaseController/ScheduleController';
import moment from 'moment';

export const getScheduleCroneTime = ({singleTime, date, time, weekDays = []}: ISchedule): Date | string => {
	const h = Number(time.split(':')[0]);
	const m = Number(time.split(':')[1]);

	const timer = moment().set({hour: h, minute: m}).subtract({minute: 2});
	return singleTime
		? new Date(Number(date))
		: `${timer.get('minute')} ${timer.get('hour')} * * ${weekDays.join(',')}`;
};
