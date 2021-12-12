import type { ObjectType } from '../../../../../types/GenericTypes';

export default (args: string, steps: ObjectType): any => {
	return steps[args];
};
