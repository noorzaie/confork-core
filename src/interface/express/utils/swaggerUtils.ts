import type { Router } from 'express';
import type swaggerUiType from 'swagger-ui-express';
import config from '../../../../config';
import type { RouterType } from '../../../../types/DependencyTypes';
import { importOpenAPISpecification } from '../../../../utils/importUtils/importProjectFileUtils';
import { importExpressSwaggerUI } from '../../../../utils/importUtils/importPackageUtils';
import type { ExpressSwaggerOptions } from '../../../../types/GenericTypes';

export const addSwaggerUi = async (router: RouterType, baseUrl: string, options?: ExpressSwaggerOptions) => {
	const swaggerDocument = await importOpenAPISpecification();
	const swaggerUi: typeof swaggerUiType = await importExpressSwaggerUI();
	(router as Router).use(
		config.documentation.uri,
		swaggerUi.serve,
		swaggerUi.setup(swaggerDocument, options?.swaggerUiOptions, options?.swaggerOptions)
	);
};
