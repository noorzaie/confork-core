import type { ParseConfigType as AQSConfigType } from 'aqs';
import type { RegisterHandlersType } from './RegisterHandlerTypes';
import type { ActionType } from './ActionTypes';
import type { AjvValidateOptionsType, Either } from '../GenericTypes';
import type { RoutSchemaType } from './RouteSchemaTypes';
import type { RouteResponseHandlersType } from './ResponseHandlerTypes';
import type { EdgeResponseHandlersType } from './EdgeResponseHandlerTypes';

export type MethodType = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

export interface SingleRouteType {
	name: string;
	method: MethodType;
	successCode?: number;
	path: string;
	active?: boolean;
	// auth: boolean;
	order?: number;
	schema?: RoutSchemaType;
	validateBody?: boolean; // According to inputSchema
	validationOption?: AjvValidateOptionsType;
	aqsOptions?: AQSConfigType;
	actions: [ActionType, ...ActionType[]]
	register?: RegisterHandlersType;
	responseHandler: RouteResponseHandlersType;
	edgeResponseHandler?: EdgeResponseHandlersType;
}

export interface GroupRouteType {
	prefix?: string;
	order?: number;
	routes: SingleRouteType[];
	register?: RegisterHandlersType;
}

export type RouteType = Either<SingleRouteType, GroupRouteType>;
