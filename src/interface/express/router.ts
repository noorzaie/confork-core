import type { Router as RouterType } from 'express';
import type { AwilixContainer } from 'awilix';
import { importRouteConfig, importRoutes } from '../../../utils/importUtils/importProjectFileUtils';
import { registerRoutes } from '../utils/routeUtils';
import scopeCreator from './middlewares/scopeCreator';
import { importFromExpress } from '../../../utils/importUtils/importPackageUtils';
import type { ExpressRouterCreatorType } from '../../../types/DependencyTypes';

const router = (container: AwilixContainer) => (): ExpressRouterCreatorType => async (): Promise<RouterType> => {
	const routes = await importRoutes();
	const Router: typeof RouterType = await importFromExpress('Router');
	const apiRouter = Router(await importRouteConfig());

	apiRouter.use(scopeCreator(container));

	await registerRoutes('express', apiRouter, routes, container);

	// console.log(apiRouter.stack);
	if (container.hasRegistration('errorHandlers.errorHandler')) {
		apiRouter.use(container.resolve('errorHandlers.errorHandler'));
	}
	if (container.hasRegistration('errorHandlers.edgeErrorHandler')) {
		apiRouter.use(container.resolve('errorHandlers.edgeErrorHandler'));
	}

	return apiRouter;
};

export default router;
