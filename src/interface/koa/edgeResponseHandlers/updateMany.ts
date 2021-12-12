import type { Context } from 'koa';
import type { EdgeResponseHandlerArgsType } from '../../../../types/routeTypes/EdgeResponseHandlerTypes';
import type { LocaleServiceType } from '../../../../types/DependencyTypes';

export default (args: EdgeResponseHandlerArgsType, LocaleService: LocaleServiceType, data: Array<unknown> | undefined, ctx: Context) => {
	ctx.body = {
		message: args && 'message' in args && args.translate === true ? LocaleService.translate(args.message!) : args?.message,
		data
	};
};
