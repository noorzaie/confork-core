import type { NextFunction, Request, Response } from 'express';
import { asValue } from 'awilix';
import type { DBRegisterHandlerArgsType } from '../../../../../types/routeTypes/RegisterHandlerTypes';
import NotFoundError from '../../../../../utils/error/NotFoundError';
import type { BaseRepositoryType } from '../../../../../types/DependencyTypes';
import type { ObjectType } from '../../../../../types/GenericTypes';

export default (...fields: DBRegisterHandlerArgsType[]) => async (req: Request, res: Response, next: NextFunction) => {
	const data: ObjectType = {};
	const baseRepo: BaseRepositoryType = req.scope.resolve('BaseRepository');

	for (const { idSource, idName, repository, toKey, throwNotFound } of fields) {
		const id = req[idSource][idName];
		const repo = req.scope.resolve(repository);
		data[toKey] = await baseRepo.findOne!(repo, id);
		if (!data[toKey] && throwNotFound !== false) {
			throw new NotFoundError();
		}
	}

	for (const [ key, value ] of Object.entries(data)) {
		req.scope.register({
			[key]: asValue(value)
		});
	}

	await next();
};
