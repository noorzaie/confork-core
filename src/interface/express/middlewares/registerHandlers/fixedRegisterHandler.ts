import type { NextFunction, Request, Response } from 'express';
import { asValue } from 'awilix';
import { setDataToPath } from '../../../../../utils/pathUtils';
import type { FixedRegisterHandlerArgsType } from '../../../../../types/routeTypes/RegisterHandlerTypes';

export default (...fields: FixedRegisterHandlerArgsType[]) => async (req: Request, res: Response, next: NextFunction) => {
	const data = {};
	for (const { key, value } of fields) {
		setDataToPath(key, data, value);
	}

	for (const [ key, value ] of Object.entries(data)) {
		req.scope.register({
			[key]: asValue(value)
		});
	}

	await next();
};
