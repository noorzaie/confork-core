export const isString = (variable: any): variable is string => {
	return typeof variable === 'string' || variable instanceof String;
};
