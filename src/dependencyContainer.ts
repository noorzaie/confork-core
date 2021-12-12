import { asClass, asFunction, asValue, createContainer, InjectionMode } from 'awilix';
import path from 'path';
import Application from './application/Application';
import { importDependencies, importLoggerConfig } from '../utils/importUtils/importProjectFileUtils';
import logger from './infrastructure/logging/logger';
import config from '../config';
import { importExpressRouter, importExpressServer, importKoaRouter, importKoaServer } from '../utils/importUtils/importLocalFileUtils';
import DB from './infrastructure/database/DB';
import BaseRepository from './infrastructure/database/BaseRepository';
import { importAqsTypeorm } from '../utils/importUtils/importPackageUtils';
import LocaleService from './infrastructure/internationalization/LocaleService';
import genericValidator from './infrastructure/validation/genericValidator';
import baseValidator from './infrastructure/validation/baseValidator';

export const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

const registerHandlers = (handlerName: string, handlersPath: string, customHandlersPath?: string) => {
	container.loadModules([
		[
			path.join(__dirname, '..', `${handlersPath}/*.js`),
			{
				register: asValue,
				lifetime: 'SINGLETON'
			}
		],
		[
			`${customHandlersPath}/*.{ts,js}`,
			{
				register: asValue,
				lifetime: 'SINGLETON'
			}
		]
	], {
		formatName: (name) => `${handlerName}.${name}`
	});
};

const registerUseCases = () => {
	container.loadModules([
		path.join(__dirname, '..', 'src/application/generic/*.js'),
		`${config.paths.useCases}/*.{ts,js}`
	],
	{
		resolverOptions:
				{
					register: asClass,
					lifetime: 'TRANSIENT'
				}
	});
};

const registerRepositories = () => {
	container.loadModules([
		[
			`${config.paths.repositories}/*.{ts,js}`,
			{
				register: asValue,
				lifetime: 'SINGLETON'
			}
		]
	]);
};

export const registerDependencies = async () => {
	container.register({
		logger: asValue(logger(config.env, await importLoggerConfig())),
		Application: asClass(Application).singleton(),
		router: asFunction(
			config.interface === 'express'
				? (await importExpressRouter())(container)
				: (await importKoaRouter())(container)
		).singleton(),
		Server: asClass(
			config.interface === 'express' ? await importExpressServer() : await importKoaServer()
		).singleton(),
		LocaleService: asClass(await LocaleService()).singleton(),
		baseValidator: asFunction(await baseValidator()).singleton(),
		genericValidator: asFunction(genericValidator).transient()
	});

	if (config.hasDb && config.useTypeorm && config.db.host && config.db.database) {
		container.register({
			DB: asClass(DB).singleton(),
			BaseRepository: asClass(await BaseRepository(config.useAqsTypeorm ? (await importAqsTypeorm()).aqsToTypeorm : undefined)).scoped()
		});
	}

	const dependencies = await importDependencies();

	for (const { paths, options } of dependencies.autoLoadingModules) {
		container.loadModules(paths, options);
	}

	container.register(dependencies.customModules);

	if (config.hasDb) {
		registerUseCases();
		registerRepositories();
	}

	registerHandlers('actionInputHandlers', 'src/interface/utils/handlers/actionHandlers/inputHandlers', config.paths.actionInputHandlers);
	registerHandlers('responseHandlers', 'src/interface/utils/handlers/responseHandlers', config.paths.responseHandlers);
	if (config.interface === 'express') {
		registerHandlers('edgeResponseHandlers', 'src/interface/express/edgeResponseHandlers', config.paths.edgeResponseHandlers);
		registerHandlers('falseConditionHandlers', 'src/interface/express/falseConditionHandlers', config.paths.actionFalseConditionHandlers);
		registerHandlers('errorHandlers', 'src/interface/express/middlewares/errorHandlers', config.paths.errorHandlers);
		registerHandlers('registerHandlers', 'src/interface/express/middlewares/registerHandlers', config.paths.registerHandlers);
	} else if (config.interface === 'koa') {
		registerHandlers('edgeResponseHandlers', 'src/interface/koa/edgeResponseHandlers', config.paths.edgeResponseHandlers);
		registerHandlers('falseConditionHandlers', 'src/interface/koa/falseConditionHandlers', config.paths.actionFalseConditionHandlers);
		registerHandlers('errorHandlers', 'src/interface/koa/middlewares/errorHandlers', config.paths.errorHandlers);
		registerHandlers('registerHandlers', 'src/interface/koa/middlewares/registerHandlers', config.paths.registerHandlers);
	}
};
