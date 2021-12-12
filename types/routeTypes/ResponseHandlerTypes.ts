import type { ConditionType } from '../ConditionTypes';
import type { Either, MethodHandlerType, ObjectType, RequestType } from '../GenericTypes';

export interface PluralSchemaType {
	plural: true;
	step: string;
	schema: Either<Omit<FieldType, 'step'>, Omit<FieldGroupType<Omit<FieldType, 'step'>>, 'step'>>[];
}

export interface SingularSchemaType {
	plural: false;
	schema: Either<FieldType, FieldGroupType<Omit<FieldType, 'step'>>>[];
}

export interface ChildSchemaType {
	plural: boolean;
	schema: Either<ChildFieldType, ChildFieldGroupType>[];
}

export interface FieldType {
	fromKey: string;
	toKey: string;
	conditions?: ConditionType;
	childes?: ChildSchemaType;
	step: string;
}

export type ChildFieldType = Omit<FieldType, 'step'>;

export interface FieldGroupType<T = FieldType> {
	// step?: string;
	step: string;
	fromKey?: string;
	conditions?: ConditionType;
	fields: (T | string)[];
}

export type ChildFieldGroupType = Omit<FieldGroupType<ChildFieldType>, 'step'>;

export type ResultFieldsType = SingularSchemaType | PluralSchemaType;

export type RouteResponseHandlersType =
	MethodHandlerType<'default', ResultFieldsType> |
	MethodHandlerType<'step', string>;

export type RouteResponseHandlerType = (args: ResultFieldsType, steps: ObjectType, req: RequestType) => any;
