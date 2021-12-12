// import type KoaRouter from '@koa/router';
import type { AwilixContainer } from 'awilix';
import type { Router as ExpressRouter } from 'express';
import type KoaRouter from '@koa/router';
import type { RegisterHandlersType } from '../../../types/routeTypes/RegisterHandlerTypes';
import type { InterfaceType, ObjectType } from '../../../types/GenericTypes';
import type { CompiledValidatorType, GenericValidatorType, RouterType } from '../../../types/DependencyTypes';
import { convertSqemaToSchema } from './jsonSchemaUtils';
import { generateRoutesSchema } from './swaggerUtils';
import config from '../../../config';
import { mergeUris } from '../../../utils/pathUtils';
import aqs from '../middlewares/aqs';
import type { GroupRouteType, MethodType, RouteType, SingleRouteType } from '../../../types/routeTypes';
import { addSwaggerUi as addKoaSwaggerUi } from '../koa/utils/swaggerUtils';
import { addSwaggerUi as addExpressSwaggerUi } from '../express/utils/swaggerUtils';
import contextParser from '../koa/utils/contextParser';
import { handleRequest as koaRequestHandler } from '../koa/utils/requestUtils';
import { handleRequest as expressRequestHandler } from '../express/utils/requestUtils';

const handleRegisters = (container: AwilixContainer, register?: RegisterHandlersType) => {
	const handlers = [];
	if (register) {
		for (const item of register) {
			handlers.push(container.resolve(`registerHandlers.${item.handler}`)(...item.args as any));
		}
	}
	return handlers;
};

const registerRoute = (router: RouterType, route: SingleRouteType, container: AwilixContainer) => {
	const { method, path, register, schema, validationOption, validateBody, actions, successCode, responseHandler, edgeResponseHandler } = route;
	let inputSchema;
	let validator: CompiledValidatorType;

	// Last step should have a name
	if (!('name' in actions[actions.length - 1])) {
		actions[actions.length - 1].name = 'lastStep';
	}
	actions[actions.length - 1].keepResponse = true; // Last step result should be kept

	if (schema && schema.input) {
		inputSchema = convertSqemaToSchema(schema.input);
	}
	if (validateBody) {
		const genericValidator: GenericValidatorType = container.resolve('genericValidator');
		validator = genericValidator(inputSchema as ObjectType, validationOption);
	}

	if (config.interface === 'koa') {
		(router as KoaRouter)[method.toLowerCase() as MethodType](
			path,
			contextParser(aqs(route.aqsOptions)),
			...handleRegisters(container, register),
			koaRequestHandler(actions, validateBody, validator!, successCode, responseHandler, edgeResponseHandler)
		);
	} else { // express
		(router as ExpressRouter)[method.toLowerCase() as MethodType](
			path,
			aqs(route.aqsOptions),
			...handleRegisters(container, register),
			expressRequestHandler(actions, validateBody, validator!, successCode, responseHandler, edgeResponseHandler)
		);
	}
};

const flattenRoutes = (container: AwilixContainer, router: RouterType, route: RouteType, outputArray: SingleRouteType[], prefix?: string, order?: number) => {
	if ('path' in route) { // It is a single route, not group
		outputArray.push({ order, ...(route as SingleRouteType), path: mergeUris(prefix, route.path) });
	} else { // It is a group of routes
		for (const childRoutes of route.routes) {
			handleRegisters(container, route.register);
			flattenRoutes(container, router, childRoutes, outputArray, mergeUris(prefix, route.prefix), route.order);
		}
	}
};

export const registerRoutes = async (Interface: InterfaceType, router: RouterType, routes: (SingleRouteType | GroupRouteType)[], container: AwilixContainer) => {
	const flattenedRoutes: SingleRouteType[] = [];
	// Convert nested route groups to a flat list of routes
	for (const route of routes) {
		flattenRoutes(container, router, route, flattenedRoutes);
	}
	for (const route of flattenedRoutes.sort(({ order: order1 }, { order: order2 }) => (order1 || 0) - (order2 || 0))) {
		if (route.active !== false) {
			registerRoute(router, route, container);
		}
	}

	if (!config.disableSwagger) {
		generateRoutesSchema(flattenedRoutes);

		if (Interface === 'koa') {
			await addKoaSwaggerUi(router, config.documentation.uri, config.documentation.swagger?.options);
		} else {
			await addExpressSwaggerUi(
				router,
				config.documentation.uri,
				config.documentation.swagger?.options
			);
		}
	}
};
