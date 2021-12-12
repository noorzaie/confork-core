import type { Request, Response } from 'express';
import type { ErrorClassesType } from '../../../../types/GenericTypes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (errorClass: ErrorClassesType, req: Request, res: Response) => {
	throw errorClass;
};
