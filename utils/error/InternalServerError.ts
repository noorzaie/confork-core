import { INTERNAL_SERVER } from '../../constants/statusCodes';
import BaseError from './BaseError';

class InternalServerError extends BaseError {
	public constructor(message: string | null = null, stack?: string) {
		super(INTERNAL_SERVER, message === undefined ? undefined : message === null ? { message: 'errors.internalServer' } : message, undefined, stack);
	}
}

export default InternalServerError;
