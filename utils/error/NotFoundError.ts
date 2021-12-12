import { NOT_FOUND } from '../../constants/statusCodes';
import BaseError from './BaseError';

class NotFoundError extends BaseError {
	public constructor(message: string | null = null, resource?: string) {
		super(NOT_FOUND, message === undefined ? undefined : message === null ? { message: 'errors.notFound', args: { resource } } : message);
	}
}

export default NotFoundError;
