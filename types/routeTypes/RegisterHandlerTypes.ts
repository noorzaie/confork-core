import type { Request as ExpressRequest, NextFunction, Response } from 'express';
import type { Context, Request as KoaRequest, Next } from 'koa';
import type { MethodHandlerType } from '../GenericTypes';
import type { ParseHandlerTypes } from '../ParseHandlerTypes';

export interface RequestRegisterHandlerArgsType {
	fromKey: string;
	toKey: string;
	default?: any;
	parser?: ParseHandlerTypes;
}

export interface FixedRegisterHandlerArgsType {
	key: string;
	value: any;
}

export interface DBRegisterHandlerArgsType {
	idSource: keyof (ExpressRequest | KoaRequest);
	idName: string;
	toKey: string;
	repository: string;
	throwNotFound?: boolean;
}

export type RegisterHandlersType = (
	MethodHandlerType<'requestRegisterHandler', RequestRegisterHandlerArgsType[]> |
	MethodHandlerType<'fixedRegisterHandler', FixedRegisterHandlerArgsType[]> |
	MethodHandlerType<'dbRegisterHandler', DBRegisterHandlerArgsType[]>
)[];

export type ExpressRegisterHandlerType = (...fields: any[]) => (req: ExpressRequest, res: Response, next: NextFunction) => void;
export type KoaRegisterHandlerType = (...fields: any[]) => (ctx: Context, next: Next) => void;
