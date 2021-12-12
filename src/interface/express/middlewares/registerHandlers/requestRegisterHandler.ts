import type { NextFunction, Request, Response } from 'express';
import { asValue } from 'awilix';
import { setDataFromPath } from '../../../../../utils/pathUtils';
import type { RequestRegisterHandlerArgsType } from '../../../../../types/routeTypes/RegisterHandlerTypes';

export default (...fields: RequestRegisterHandlerArgsType[]) => async (req: Request, res: Response, next: NextFunction) => {
	const data = {};
	for (const { fromKey, toKey, default: defaultValue, parser } of fields) {
		setDataFromPath(fromKey, toKey, req, data, defaultValue, parser);
	}

	for (const [ key, value ] of Object.entries(data)) {
		req.scope.register({
			[key]: asValue(value)
		});
	}

	await next();
};
