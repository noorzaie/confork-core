import type { Request, Response } from 'express';
import type { Context } from 'koa';
import type { MethodHandlerType, ObjectType } from '../GenericTypes';
import type { LocaleServiceType } from '../DependencyTypes';

export interface EdgeResponseHandlerArgsType {
	message?: string;
	translate?: boolean;
}

export type ExpressEdgeResponseHandlerType =
	(
		args: EdgeResponseHandlerArgsType,
		LocalService: LocaleServiceType,
		data: ObjectType,
		req: Request,
		res: Response
	) => any;

export type KoaEdgeResponseHandlerType =
	(
		args: EdgeResponseHandlerArgsType,
		LocalService: LocaleServiceType,
		data: ObjectType,
		ctx: Context
	) => any;

export type EdgeResponseHandlersType =
	MethodHandlerType<'get', EdgeResponseHandlerArgsType> |
	MethodHandlerType<'list', EdgeResponseHandlerArgsType> |
	MethodHandlerType<'post', EdgeResponseHandlerArgsType> |
	MethodHandlerType<'update', EdgeResponseHandlerArgsType> |
	MethodHandlerType<'updateMany', EdgeResponseHandlerArgsType> |
	MethodHandlerType<'delete', EdgeResponseHandlerArgsType> |
	MethodHandlerType<'deleteMany', EdgeResponseHandlerArgsType>;
