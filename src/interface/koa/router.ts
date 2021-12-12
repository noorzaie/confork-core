import type { AwilixContainer } from 'awilix';
import type RouterType from '@koa/router';
import scopeCreator from './middlewares/scopeCreator';
import { registerRoutes } from '../utils/routeUtils';
import { importRouteConfig, importRoutes } from '../../../utils/importUtils/importProjectFileUtils';
import { importKoaRouterPackage } from '../../../utils/importUtils/importPackageUtils';
import type { KoaRouterCreatorType } from '../../../types/DependencyTypes';
import config from '../../../config';

const router = (container: AwilixContainer) => (): KoaRouterCreatorType => async (): Promise<RouterType> => {
	const routes = await importRoutes();
	const Router = await importKoaRouterPackage();

	const apiRouter = new Router({
		prefix: config.http.basePath || '/',
		...await importRouteConfig()
	});

	apiRouter.use(await scopeCreator(container));

	if (container.hasRegistration('errorHandlers.errorHandler')) {
		apiRouter.use(await container.resolve('errorHandlers.errorHandler'));
	}

	await registerRoutes('koa', apiRouter, routes, container);
	// console.log(routes, apiRouter.stack.map(i => i.path));

	return apiRouter;
};

export default router;
