import type { Context, Next } from 'koa';
import { asValue } from 'awilix';
import type { DBRegisterHandlerArgsType } from '../../../../../types/routeTypes/RegisterHandlerTypes';
import NotFoundError from '../../../../../utils/error/NotFoundError';
import type { BaseRepositoryType } from '../../../../../types/DependencyTypes';
import type { ObjectType } from '../../../../../types/GenericTypes';

export default (...fields: DBRegisterHandlerArgsType[]) => async (ctx: Context, next: Next) => {
	const data: ObjectType = {};
	const baseRepo: BaseRepositoryType = ctx.request.scope.resolve('BaseRepository');

	for (const { idSource, idName, repository, toKey, throwNotFound } of fields) {
		const id = ctx.request[idSource][idName];
		const repo = ctx.request.scope.resolve(repository);
		data[toKey] = await baseRepo.findOne!(repo, id);
		if (!data[toKey] && throwNotFound !== false) {
			throw new NotFoundError();
		}
	}

	for (const [ key, value ] of Object.entries(data)) {
		ctx.request.scope.register({
			[key]: asValue(value)
		});
	}

	await next();
};
