import { Request, Response } from 'express';
import type { ObjectType } from '../../../../types/GenericTypes';
import type { LocaleServiceType } from '../../../../types/DependencyTypes';
import type { EdgeResponseHandlerArgsType } from '../../../../types/routeTypes/EdgeResponseHandlerTypes';

export default (args: EdgeResponseHandlerArgsType, LocaleService: LocaleServiceType, data: ObjectType, req: Request, res: Response) => {
	res.send(
		{
			message: args && 'message' in args && args.translate === true ? LocaleService.translate(args.message!) : args?.message,
			data
		}
	);
};
