import type { Either } from './GenericTypes';

export type ConditionSourceType = 'step' | 'container' | 'request' | 'fixed';

export type CompareOperatorsType = 'eq' | 'in' | 'neq' | 'nin'

export interface EdgeConditionType {
	leftSource: ConditionSourceType;
	leftPath: string;
	rightSource: ConditionSourceType;
	rightPath: any; // Path or value (if handler is fixedHandler)
	operator: CompareOperatorsType;
}

export interface ConditionsGroupType {
	operator: 'and' | 'or';
	conditions: Either<ConditionsGroupType, EdgeConditionType>[];
}

export type ConditionType = Either<EdgeConditionType, ConditionsGroupType>;
