export const isObject = (variable: any): variable is object => {
	return typeof variable === 'object'
		&& !Array.isArray(variable)
		&& variable !== null;
};
