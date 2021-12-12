import type { Request, Response } from 'express';
import type { EdgeResponseHandlerArgsType } from '../../../../types/routeTypes/EdgeResponseHandlerTypes';
import type { LocaleServiceType } from '../../../../types/DependencyTypes';
import type { ObjectType } from '../../../../types/GenericTypes';

export default (args: EdgeResponseHandlerArgsType, LocaleService: LocaleServiceType, data: ObjectType, req: Request, res: Response) => {
	res.send(
		{
			message: args && 'message' in args && args.translate === true ? LocaleService.translate(args.message!) : args?.message,
			data: data.data || data,
			total: data.total,
			page: req.scope.resolve('page', { allowUnregistered: true }),
			perPage: req.scope.resolve('perPage', { allowUnregistered: true })
		}
	);
};
