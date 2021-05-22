import {ISchedule} from 'helpers/DatabaseController/ScheduleController';
import moment from 'moment';

export const getScheduleCroneTime = ({singleTime, date, time, weekDays = []}: ISchedule): Date | string => {
	const h = Number(time.split(':')[0]);
	const m = Number(time.split(':')[1]);

	const timer = moment().set({hour: h, minute: m}).subtract({minute: 2});

	if (singleTime) {
		const _date = moment.unix(date / 1000);
		_date.set({hour: h, minute: m});
		_date.add({minute: 2});
		return _date.toDate();
	}

	return `${timer.get('minute')} ${timer.get('hour')} * * ${weekDays.join(',')}`;
};
