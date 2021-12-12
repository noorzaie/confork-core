import type { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER } from '../../../../../constants/statusCodes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (error: any, req: Request, res: Response, next: NextFunction) => {
	res.status(INTERNAL_SERVER).send({ message: 'Some error occurred!' });
};
