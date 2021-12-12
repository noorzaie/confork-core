import { path as rootPath } from 'app-root-path';
import type { ConfigType } from './types/ConfigTypes';

export default {
	rootPath,
	env: 'development',
	interface: 'express',
	disableSwagger: false,
	paths: {
		config: 'config',
		schema: 'schema',
		routes: 'routes',
		repositories: 'src/infrastructure/database/repositories',
		useCases: 'src/useCases',
		// customRouter: 'src/interface/express/customRouter',
		actionInputHandlers: 'src/interface/utils/handlers/actionInputHandlers',
		responseHandlers: 'src/interface/utils/handlers/responseHandlers'
		// registerHandlers: 'src/interface/express/middlewares/registerHandlers',
		// edgeResponseHandlers: 'src/interface/express/edgeResponseHandlers',
		// actionFalseConditionHandlers: 'src/interface/express/falseConditionHandlers',
		// errorHandlers: 'src/interface/express/middlewares/errorHandlers'
		// middlewares: 'src/interface/express/middlewares'
	},
	http: {
		host: 'localhost',
		port: 7000,
		basePath: '/api/v1'
	},
	hasDb: false,
	useAqsTypeorm: false,
	locale: 'en',
	documentation: {
		uri: '/docs'
	}
} as ConfigType;
