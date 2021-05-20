export const getSeconds = (hourString: string): number => {
	const a = hourString.split(':');

	const seconds = +a[0] * 60 * 60 + +a[1] * 60;

	return seconds;
};
