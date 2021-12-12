import type { Request, Response } from 'express';
import type { Context } from 'koa';
import type { ErrorClassesType, MethodHandlerType } from '../GenericTypes';
import type { ActionInputHandlersType } from './ActionInputHandlerTypes';
import type { ConditionType } from '../ConditionTypes';

export type ExpressActionFalseConditionHandlerType = (errorClass: ErrorClassesType, req: Request, res: Response) => any;

export type KoaActionFalseConditionHandlerType = (errorClass: ErrorClassesType, ctx: Context) => any;

export type ActionFalseConditionHandlersType = MethodHandlerType<'throwHandler', ErrorClassesType>;

export interface ActionType {
	// register?: RegisterHandlers | MethodHandlerType<'stepRegisterHandler', StepHandlerArgsType>[];
	name?: string;
	keepResponse?: boolean;
	inputs?: ActionInputHandlersType; // Per module injection
	handler: string; //
	conditions?: ConditionType;
	falseConditionHandler?: ActionFalseConditionHandlersType;
	async?: boolean;
	startTransaction?: boolean;
	endTransaction?: boolean;
	// resultFields?: ResultFieldsType;
}
