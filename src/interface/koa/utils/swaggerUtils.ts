import type Router from '@koa/router';
import type { RouterType } from '../../../../types/DependencyTypes';
import { importOpenAPISpecification } from '../../../../utils/importUtils/importProjectFileUtils';
import { importKoaSwaggerUI } from '../../../../utils/importUtils/importPackageUtils';
import type { KoaSwaggerOptions } from '../../../../types/GenericTypes';

export const addSwaggerUi = async (router: RouterType, baseUrl: string, options?: KoaSwaggerOptions) => {
	const swaggerDocument = await importOpenAPISpecification();
	const { koaSwagger } = await importKoaSwaggerUI();

	(router as Router).get(baseUrl, koaSwagger({
		...(options || {}),
		routePrefix: false,
		swaggerOptions: {
			...options?.swaggerOptions,
			spec: swaggerDocument
		}
	}));
};
