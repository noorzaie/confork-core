import type { Request, Response, NextFunction } from 'express';
import type { ParseConfigType } from 'aqs';
import { parse } from 'aqs';

export default (config?: ParseConfigType) => async (req: Request, res: Response, next: NextFunction) => {
	if (req.url.indexOf('?') > 0) {
		req.aqs = parse(req.url.substr(req.url.indexOf('?') + 1), config);
	}
	await next();
};
