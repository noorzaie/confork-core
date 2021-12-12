import type { AwilixContainer } from 'awilix';
import { INTERNAL_SERVER } from '../../../constants/statusCodes';
import BaseError from '../../../utils/error/BaseError';
import type { ResponseErrorsType } from '../../../types/GenericTypes';
import { isString } from '../../../utils/stringUtils';
import InternalServerError from '../../../utils/error/InternalServerError';
import type { LocaleServiceType, LoggerType } from '../../../types/DependencyTypes';
import config from '../../../config';

export const getErrorObject = (error: BaseError | Error | unknown, container: AwilixContainer) => {
	const LocaleService: LocaleServiceType = container.resolve('LocaleService');
	const logger: LoggerType = container.resolve('logger');
	// const config: ConfigType = container.resolve('config');

	if (container.hasRegistration('transactionConnections')) {
		const db = container.resolve('DB');
		for (const tc of container.resolve('transactionConnections')) {
			db.rollbackTransaction(tc);
		}
	}

	let code: number;
	let message: string | undefined;
	let stack: string | undefined;
	let errors: ResponseErrorsType | undefined;

	if (error instanceof BaseError) {
		code = error.code;
		message = error.message === undefined ? undefined : isString(error.message) ? error.message : LocaleService.translate(error.message.message, error.message.args);
		stack = error.stack;
		errors = error.errors;

		if (error instanceof InternalServerError) {
			logger.error(error.message as string || 'Internal server error', error);
		}
	} else if (error instanceof Error) {
		code = INTERNAL_SERVER;
		message = config.isDev ? error.message : LocaleService.translate('errors.internalServer');
		stack = error.stack;

		logger.error(error.message, error);
	} else {
		code = INTERNAL_SERVER;
		message = LocaleService.translate('errors.internalServer');
	}

	return {
		code,
		error: { message, errors, stack: config.isDev ? stack : undefined }
	};
};
