import type { NextFunction, Request, Response } from 'express';
import BaseError from '../../../../../utils/error/BaseError';
import type { ExpressErrorHandlerType } from '../../../../../types/DependencyTypes';
import { getErrorObject } from '../../../utils/errorUtils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ExpressErrorHandlerType = (error: BaseError | Error | unknown, req: Request, res: Response, next: NextFunction) => {
	const errorObject = getErrorObject(error, req.scope);

	res.status(errorObject.code).send(errorObject.error);
};

export default errorHandler;
