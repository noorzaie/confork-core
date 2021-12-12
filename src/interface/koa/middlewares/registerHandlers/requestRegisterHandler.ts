import type { Context, Next } from 'koa';
import { asValue } from 'awilix';
import { setDataFromPath } from '../../../../../utils/pathUtils';
import type { RequestRegisterHandlerArgsType } from '../../../../../types/routeTypes/RegisterHandlerTypes';

export default (...fields: RequestRegisterHandlerArgsType[]) => async (ctx: Context, next: Next) => {
	const data = {};
	for (const { fromKey, toKey, default: defaultValue, parser } of fields) {
		setDataFromPath(fromKey, toKey, ctx.request, data, defaultValue, parser);
	}

	for (const [ key, value ] of Object.entries(data)) {
		ctx.request.scope.register({
			[key]: asValue(value)
		});
	}

	await next();
};
