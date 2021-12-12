import type { Context } from 'koa';
import type { EdgeResponseHandlerArgsType } from '../../../../types/routeTypes/EdgeResponseHandlerTypes';
import type { LocaleServiceType } from '../../../../types/DependencyTypes';
import type { ObjectType } from '../../../../types/GenericTypes';

export default (args: EdgeResponseHandlerArgsType, LocaleService: LocaleServiceType, data: ObjectType, ctx: Context) => {
	ctx.body = {
		message: args && 'message' in args && args.translate === true ? LocaleService.translate(args.message!) : args?.message,
		data: data.data || data,
		total: data.total,
		page: ctx.request.scope.resolve('page', { allowUnregistered: true }),
		perPage: ctx.request.scope.resolve('perPage', { allowUnregistered: true })
	};
};
