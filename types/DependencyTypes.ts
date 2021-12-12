import type winston from 'winston';
import type { Express, NextFunction, Request, Response, Router as ExpressRouter } from 'express';
import type Koa from 'koa';
import type KoaRouter from '@koa/router';
import type { JSONSchemaType } from 'ajv';
import type { ParseReturnType } from 'aqs';
import type { ConfigType as AQSTypeOrmConfigType } from 'aqs-typeorm';
import type { Connection, EntityManager, ObjectType as TypeOrmObjectType, TypeORMError } from 'typeorm';
import type { Context, Next } from 'koa';
import type Server from '../src/interface/express/Server';
import type Application from '../src/application/Application';
import type { LocaleServiceType as LocaleService } from '../src/infrastructure/internationalization/LocaleService';
import type DB from '../src/infrastructure/database/DB';
import type { AjvValidateOptionsType, ObjectType } from './GenericTypes';
import type BaseError from '../utils/error/BaseError';

export type ServerType = Server;
export type ApplicationType = Application;
export type LoggerType = winston.Logger;
export type RouterType = ExpressRouter | KoaRouter;
export type ExpressRouterCreatorType = () => Promise<ExpressRouter>;
export type KoaRouterCreatorType = () => Promise<KoaRouter>;
export type CustomExpressRouterType = (router: ExpressRouter, app: Express) => void;
export type CustomKoaRouterType = (router: KoaRouter, app: Koa) => void;
export type LocaleServiceType = LocaleService;
export type CompiledValidatorType = (data: any) => void;
export type BaseValidatorType = (schema: JSONSchemaType<unknown>, options?: { resourcePath?: string; }) => CompiledValidatorType;
export type GenericValidatorType = (properties: ObjectType, options?: AjvValidateOptionsType) => CompiledValidatorType;
export type ExpressErrorHandlerType = (error: BaseError | Error | unknown, req: Request, res: Response, next: NextFunction) => void;
export type KoaErrorHandlerType = (ctx: Context, next: Next) => Promise<void>;

export type DBType = DB;
export type RepositoryType = TypeOrmObjectType<unknown>;
export type ConnectionType = EntityManager | Connection;
export interface BaseRepositoryType {
	readonly LocaleService: LocaleServiceType;
	readonly connection: ConnectionType;
	findAll?(repository: RepositoryType, criteria: any, aqsTypeOrmConfig?: AQSTypeOrmConfigType): Promise<any[]>;
	findOne(repository: RepositoryType, entity: number | ObjectType, relations?: string[]): Promise<any>;
	create?(repository: RepositoryType, data: ObjectType): Promise<any[]>;
	addAssociation?(repository: RepositoryType, entity: number | ObjectType, relationKey: string, relationData: ObjectType | (ObjectType | number)[] | number, relationRepository: RepositoryType, keepOld: boolean): Promise<any[]>;
	removeAssociation?(repository: RepositoryType, entity: number | ObjectType, relationKey: string, relationId: number | number[]): Promise<any[]>;
	update?(repository: RepositoryType, entity: number | ObjectType, data: ObjectType): Promise<number | undefined>;
	delete?(repository: RepositoryType, entity: number | ObjectType, soft?: boolean): Promise<number | undefined | null>;
	deleteMany?(repository: RepositoryType, params: ParseReturnType, soft?: boolean): Promise<number | undefined | null>;
	handleErrors?(error: TypeORMError): never;
}

export interface DatabaseType {
	connect(): Promise<void>;
	startTransaction(): Promise<any>;
	commitTransaction(queryRunner: any): Promise<void>;
	rollbackTransaction(queryRunner: any): Promise<void>;
	getConnection(): any;
	stop(): Promise<void>;
}
