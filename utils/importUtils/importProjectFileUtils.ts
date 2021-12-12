import merge from 'lodash.merge';
import config from '../../config';
import type { PathsType } from '../../types/ConfigTypes';
import type { RouteType } from '../../types/routeTypes';
import { getInstalledInterface } from './importPackageUtils';
import { importFromPath } from './index';

export const importPackageJson = async () => {
	return importFromPath('package.json');
};

export const loadConforkrc = async () => {
	const conforkrc = await importFromPath('.conforkrc.js', {});
	config.env = conforkrc?.env || 'production';
	config.isDev = config.env === 'development';
	config.paths = conforkrc?.paths ? { ...config.paths, ...conforkrc?.paths } : config.paths;
	config.interface = conforkrc?.interface || await getInstalledInterface();
	config.disableSwagger = conforkrc?.disableSwagger;
	config.http = conforkrc?.http ? { ...config.http, ...conforkrc?.http } : config.http;
	config.db = conforkrc?.db;
	config.hasDb = !!config.db;
	config.useTypeorm = !!conforkrc?.useTypeorm;
	config.useAqsTypeorm = !!conforkrc?.useAqsTypeorm;
	config.locale = conforkrc?.locale || config.locale;
	config.documentation = merge(config.documentation, await importDocumentationConfig() || {});
};

export const importFromCustomPath = async (module: keyof PathsType, file?: string, defaultValue?: any, getDefault?: boolean) => {
	return importFromPath(file ? `${config.paths[module]}/${file}` : config.paths[module], defaultValue, getDefault);
};

export const importDependencies = async () => {
	return importFromCustomPath('config', 'awilix', undefined, false);
};

export const importLoggerConfig = async () => {
	return importFromCustomPath('config', 'logger', {});
};

export const importI18nConfig = async () => {
	return importFromCustomPath('config', 'i18n');
};

export const importDocumentationConfig = async () => {
	return importFromCustomPath('config', 'documentation', null);
};

export const importAjvConfig = async () => {
	return importFromCustomPath('config', 'ajv', {});
};

export const importRouteConfig = async () => {
	return importFromCustomPath('config', 'router', {});
};

export const importRoutes = async (): Promise<RouteType[]> => {
	return importFromCustomPath('routes', undefined, []);
};

export const importOpenAPISpecification = async () => {
	return importFromCustomPath('schema', 'swaggerSchema.json', {});
};

export const importCustomRouter = async () => {
	return importFromCustomPath('customRouter', undefined, undefined);
};
