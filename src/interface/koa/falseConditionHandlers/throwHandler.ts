import type { Context } from 'koa';
import type { ErrorClassesType } from '../../../../types/GenericTypes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (errorClass: ErrorClassesType, ctx: Context) => {
	throw errorClass;
};
