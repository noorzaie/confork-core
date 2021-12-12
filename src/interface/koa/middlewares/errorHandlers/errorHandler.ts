import type { Context, Next } from 'koa';
import type { KoaErrorHandlerType } from '../../../../../types/DependencyTypes';
import { getErrorObject } from '../../../utils/errorUtils';

const errorHandler: KoaErrorHandlerType = async (ctx: Context, next: Next) => {
	try {
		await next();
	} catch (error: unknown) {
		const errorObject = getErrorObject(error, ctx.request.scope);

		ctx.response.status = errorObject.code;
		ctx.response.body = errorObject.error;
	}
};

export default errorHandler;
