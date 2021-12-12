import type { ResolveOptions } from 'awilix/lib/container';
import type { MethodHandlerType, ObjectType, RequestType } from '../GenericTypes';
import type { ParseHandlerTypes } from '../ParseHandlerTypes';

// First argument of input handler method
export interface ActionInputHandlerSourceArgType {
	steps: ObjectType;
	req: RequestType;
}

// Second argument of input handler method
export interface StepInputHandlerArgsType {
	name: string; // Step name
	fromKey?: string;
	toKey: string;
	default?: any;
}

export interface RequestHandlerArgsType {
	fromKey: string;
	toKey: string;
	default?: any;
	parser?: ParseHandlerTypes;
}

export interface ContainerHandlerArgsType {
	fromKey: string;
	toKey: string;
	options?: ResolveOptions
}

// Input handler method type
export interface ActionInputHandlerType {
	(sources: ActionInputHandlerSourceArgType, ...args: any[]): ObjectType;
}

// Input handler of action
export type ActionInputHandlersType = (
	MethodHandlerType<'stepHandler', StepInputHandlerArgsType[]> |
	MethodHandlerType<'requestHandler', RequestHandlerArgsType[]> |
	MethodHandlerType<'containerHandler', ContainerHandlerArgsType[]> |
	MethodHandlerType<'fixedHandler', ObjectType[]>
)[];
