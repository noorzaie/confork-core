import { asValue } from 'awilix';
import type { Context, Next } from 'koa';
import { setDataToPath } from '../../../../../utils/pathUtils';
import type { FixedRegisterHandlerArgsType } from '../../../../../types/routeTypes/RegisterHandlerTypes';

export default (...fields: FixedRegisterHandlerArgsType[]) => async (ctx: Context, next: Next) => {
	const data = {};
	for (const { key, value } of fields) {
		setDataToPath(key, data, value);
	}

	for (const [ key, value ] of Object.entries(data)) {
		ctx.request.scope.register({
			[key]: asValue(value)
		});
	}

	await next();
};
