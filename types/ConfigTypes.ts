import type { Options as AjvOptionsType } from 'ajv';
import type { OpenAPIV3_1 as OpenAPIType } from 'openapi-types';
import type { Either, EnvType, ExpressSwaggerOptions, InterfaceType, KoaSwaggerOptions, ObjectType } from './GenericTypes';

interface HttpConfigType {
	port: number;
	host: string;
	basePath: string;
}

export interface AjvConfigType {
	options: AjvOptionsType;
	translateErrors: boolean;
}

interface DBConfigType {
	dialect: 'postgres';
	host: string;
	port: number;
	database: string;
	username: string;
	password: string;
	otherDbOptions?: ObjectType;
}

export interface DocumentationType {
	uri: string;
	swagger: {
		customSpecification: Omit<OpenAPIType.Document, 'paths'>;
		options?: Either<ExpressSwaggerOptions, KoaSwaggerOptions>;
	}
}

export interface PathsType {
	config: string;
	schema: string;
	routes: string;
	customRouter: string;
	repositories: string;
	useCases: string;
	actionInputHandlers: string;
	responseHandlers: string;
	edgeResponseHandlers: string;
	actionFalseConditionHandlers: string;
	registerHandlers: string;
	errorHandlers: string;
	// middlewares: string;
}

export interface ConfigType {
	rootPath: string;
	interface: InterfaceType;
	disableSwagger: boolean;
	paths: PathsType;
	isDev: boolean;
	env: EnvType;
	db: DBConfigType;
	hasDb: boolean;
	useTypeorm: boolean;
	useAqsTypeorm: boolean;
	http: HttpConfigType;
	locale: string;
	ajv: AjvConfigType;
	// i18n: I18nOptionsType;
	documentation: DocumentationType;
}
