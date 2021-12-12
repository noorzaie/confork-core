import type { OpenAPIV3_1 as OpenAPIType } from 'openapi-types';
import type { DeepPartial, Either } from '../GenericTypes';

export interface RouteSchemaDatabaseType {
	table: string;
	fields: string | string[];
}

export interface RouteSchemaDatabaseTypeAllFields {
	table: string;
	fields: 'all';
	exclude?: string[];
}

export interface RouteSchemaCustomType {
	path: string;
	fields: string | string[];
}

export interface RouteSchemaCustomTypeAllFields {
	path: string;
	fields: 'all';
	exclude?: string[];
}

export interface RouteSchemaDirectType {
	schema: {
		[key:string]: OpenAPIType.SchemaObject;
	}
}

export interface OutputType {
	dataKey?: string;
	messageKey?: string | undefined;
	isArray?: boolean;
	schema: Either<RouteSchemaDatabaseType | RouteSchemaDatabaseTypeAllFields, RouteSchemaCustomType | RouteSchemaCustomTypeAllFields>[];
}

export type RouteInputSchemaType = Either<Either<RouteSchemaDatabaseType | RouteSchemaDatabaseTypeAllFields, RouteSchemaCustomType | RouteSchemaCustomTypeAllFields>, RouteSchemaDirectType>[];

export interface RoutSchemaType {
	input?: RouteInputSchemaType;
	output?: OutputType;
	customSpecification?: DeepPartial<OpenAPIType.OperationObject>;
}
