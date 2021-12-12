export const isArray = (value: any): value is Array<unknown> => {
	return value.constructor === Array;
};
