/* eslint import/no-unresolved: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

import type { InterfaceType } from '../../types/GenericTypes';
import { importPackageJson } from './importProjectFileUtils';

export const getInstalledInterface = async (): Promise<InterfaceType> => {
	return importPackageJson()
		.then(
			packageJson => (
				Object.prototype.hasOwnProperty.call(packageJson.dependencies, 'express') ? 'express' : 'koa'
			)
		);
};

export const importExpress = async () => {
	return (await import('express')).default;
};

export const importFromExpress = async (module: string) => {
	return ((await import('express')).default as any)[module];
};

export const importKoa = async () => {
	return (await import('koa')).default;
};

export const importKoaRouterPackage = async () => {
	return (await import('@koa/router')).default;
};

export const importKoaBodyParser = async () => {
	return (await import('koa-bodyparser')).default;
};

export const importExpressSwaggerUI = async () => {
	return (await import('swagger-ui-express')).default;
};

export const importMorgan = async () => {
	return (await import('morgan')).default;
};

export const importKoaSwaggerUI = async () => {
	return import('koa2-swagger-ui');
};

export const importKoaLogger = async () => {
	return (await import('koa-logger')).default;
};

export const importAqsTypeorm = async () => {
	return import('aqs-typeorm');
};

export const importTypeorm = async () => {
	return import('typeorm');
};
