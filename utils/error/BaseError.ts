import type { ObjectType, ResponseErrorsType } from '../../types/GenericTypes';

class BaseError {
	public constructor(public readonly code: number, public readonly message?: { message: string; args?: ObjectType } | string, public readonly errors?: ResponseErrorsType, public readonly stack?: string) {
	}
}

export default BaseError;
