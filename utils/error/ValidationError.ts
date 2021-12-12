import { VALIDATION } from '../../constants/statusCodes';
import type { ResponseErrorsType } from '../../types/GenericTypes';
import BaseError from './BaseError';

class ValidationError extends BaseError {
	public constructor(errors: ResponseErrorsType, message: string | null = null) {
		super(VALIDATION, message === undefined ? undefined : message === null ? { message: 'errors.validation' } : message, errors);
	}
}

export default ValidationError;
