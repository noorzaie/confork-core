import type { Request, Response, NextFunction } from 'express';
import type { AwilixContainer } from 'awilix';

export default (container: AwilixContainer) => (req: Request, res: Response, next: NextFunction) => {
	req.scope = container.createScope();
	next();
};
