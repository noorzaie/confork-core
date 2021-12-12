import type { ParseReturnType } from 'aqs';
import type { Repository, TypeORMError } from 'typeorm';
import type { aqsToTypeorm as AqsToTypeormType, ConfigType as AQSTypeOrmConfigType } from 'aqs-typeorm';
import type { ObjectType } from '../../../types/GenericTypes';
import type { BaseRepositoryType, ConnectionType, LocaleServiceType, RepositoryType } from '../../../types/DependencyTypes';
import { isNumber } from '../../../utils/numberUtils';
import { isArray } from '../../../utils/arrayUtils';
import InternalServerError from '../../../utils/error/InternalServerError';
import { isObject } from '../../../utils/objectUtils';
import { importTypeorm } from '../../../utils/importUtils/importPackageUtils';

export default async (aqsToTypeorm: typeof AqsToTypeormType | undefined) => {
	const { EntityColumnNotFound, QueryFailedError } = await importTypeorm();

	return class BaseRepository implements BaseRepositoryType {
		public constructor(public readonly LocaleService: LocaleServiceType, public readonly connection: ConnectionType) {
			if ('manager' in this.connection) {
				this.connection = this.connection.manager;
			}
		}

		public findAll = async (repository: RepositoryType, criteria: ParseReturnType, aqsTypeOrmConfig?: AQSTypeOrmConfigType): Promise<any[]> => {
			const repo = this.connection.getCustomRepository(repository) as unknown as Repository<any>;
			const builder = repo.createQueryBuilder();
			if (aqsToTypeorm) {
				try {
					aqsToTypeorm(criteria, builder, aqsTypeOrmConfig);
				} catch (e: any) {
					return this.handleErrors(e);
				}
			}
			return builder.getManyAndCount().catch(this.handleErrors);
		}

		public findOne = async (repository: RepositoryType, entity: number | ObjectType, relations: string[] = []): Promise<any> => {
			if (isObject(entity)) {
				if (relations.length > 0 && !(relations[0] in entity)) {
					const repo = this.connection.getCustomRepository(repository) as unknown as Repository<any>;
					return repo.findOne(entity.id, { relations }).catch(this.handleErrors);
				} else {
					return entity;
				}
			} else {
				const repo = this.connection.getCustomRepository(repository) as unknown as Repository<any>;
				return repo.findOne(entity, { relations }).catch(this.handleErrors);
			}
		}

		public create = async (repository: RepositoryType, data: ObjectType): Promise<any[]> => {
			const repo = this.connection.getCustomRepository(repository) as unknown as Repository<any>;
			return repo.save(repo.create(data)).catch(this.handleErrors);
		}

		public addAssociation = async (repository: RepositoryType, entity: number | ObjectType, relationKey: string, relationData: ObjectType | (ObjectType | number)[] | number, relationRepository: RepositoryType, keepOld: boolean): Promise<any[]> => {
			const repo = this.connection.getCustomRepository(repository) as unknown as Repository<any>;

			if (!isObject(entity)) {
				entity = await repo.findOne(entity, { relations: [ relationKey ] }).catch(this.handleErrors);
			}

			const relationRepo = this.connection.getCustomRepository(relationRepository) as unknown as Repository<any>;
			let relation;
			if (isArray(relationData)) {
				relation = await Promise.all(
					relationData.map(dt => (
						isNumber(dt)
							? relationRepo.findOne(dt).catch(this.handleErrors)
							: relationRepo.save(relationRepo.create(dt)).catch(this.handleErrors)))
				);
			} else {
				relation = isNumber(relationData)
					? [ await relationRepo.save(await relationRepo.findOne(relationData).catch(this.handleErrors)).catch(this.handleErrors) ]
					: [ await relationRepo.save(relationRepo.create(relationData)).catch(this.handleErrors) ];
			}

			if (keepOld === false) {
				(entity as any)[relationKey] = relation;
			} else {
				(entity as any)[relationKey] = [ ...(entity as any)[relationKey], ...relation ];
			}

			return repo.save(entity as any).catch(this.handleErrors);
		}

		// For many-to-many relations
		public removeAssociation = async (repository: RepositoryType, entity: number | ObjectType, relationKey: string, relationId: number | number[]): Promise<any[]> => {
			const repo = this.connection.getCustomRepository(repository) as unknown as Repository<any>;

			if (!isObject(entity)) {
				await repo.findOne(entity, { relations: [ relationKey ] }).catch(this.handleErrors);
			}

			if (isArray(relationId)) {
				(entity as any)[relationKey] = (entity as any)[relationKey].filter((relation: any) => !relationId.includes(relation.id));
			} else {
				(entity as any)[relationKey] = (entity as any)[relationKey].filter((relation: any) => relation.id !== relationId);
			}

			return repo.save(entity as any).catch(this.handleErrors);
		}

		public update = async (repository: RepositoryType, entity: number | ObjectType, data: ObjectType): Promise<number | undefined> => {
			const repo = this.connection.getCustomRepository(repository) as unknown as Repository<any>;
			return repo.update(isObject(entity) ? entity.id : entity, data).then(({ affected }) => affected).catch(this.handleErrors);
		}

		public delete = async (repository: RepositoryType, entity: number | ObjectType, soft?: boolean): Promise<number | undefined | null> => {
			const repo = this.connection.getCustomRepository(repository) as unknown as Repository<any>;
			return soft === true
				? repo.softDelete(isObject(entity) ? entity.id : entity).then(({ affected }) => affected).catch(this.handleErrors)
				: repo.delete(isObject(entity) ? entity.id : entity).then(({ affected }) => affected).catch(this.handleErrors);
		}

		public deleteMany = async (repository: RepositoryType, params: ParseReturnType, soft?: boolean): Promise<number | undefined | null> => {
			const repo = this.connection.getCustomRepository(repository) as unknown as Repository<any>;
			const builder = repo.createQueryBuilder();

			if (aqsToTypeorm) {
				try {
					aqsToTypeorm(params, builder);
				} catch (e: any) {
					return this.handleErrors(e);
				}
			}

			if (soft === true) {
				return builder.softDelete().execute().then(({ affected }) => affected).catch(this.handleErrors);
			} else {
				return builder.delete().execute().then(({ affected }) => affected).catch(this.handleErrors);
			}
		}

		public handleErrors = (error: TypeORMError): never => {
			// https://github.com/typeorm/typeorm/tree/master/src/error
			if (error instanceof QueryFailedError) {
				// https://www.postgresql.org/docs/13/errcodes-appendix.html
				const message = this.LocaleService.translate(`dbErrors.${(error as any).code}`);
				throw new InternalServerError(message === `dbErrors.${(error as any).code}` ? error.message : message, error.stack);
			} else if (error instanceof EntityColumnNotFound) {
				throw new InternalServerError(this.LocaleService.translate('dbErrors.columnNotFound'), error.stack);
			} else {
				throw new InternalServerError(error.message, error.stack);
			}
		}
	};
};
