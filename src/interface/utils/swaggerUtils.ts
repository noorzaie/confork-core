import type { OpenAPIV3_1 as OpenAPIType } from 'openapi-types';
import fs from 'fs';
import merge from 'lodash.merge';
import type { SingleRouteType } from '../../../types/routeTypes';
import { convertSqemaToSchema } from './jsonSchemaUtils';
import config from '../../../config';
import { mergeUris, joinPaths } from '../../../utils/pathUtils';

const convertPathToSwaggerPath = (path: string) => {
	return path.split('/')
		.map((pp => (pp.startsWith(':') ? `{${pp.substr(1)}}` : pp)))
		.join('/');
};

export const generateRoutesSchema = (routes: SingleRouteType[]): void => {
	const paths: OpenAPIType.PathsObject = {};
	for (const route of routes) {
		const fullPath = convertPathToSwaggerPath(mergeUris(config.http.basePath, route.path));
		if (!(fullPath in paths)) {
			paths[fullPath] = {};
		}
		paths[fullPath] = { ...paths[fullPath], ...generatePathsSchema(route) };
	}

	const schema: OpenAPIType.Document = {
		...(config.documentation?.swagger?.customSpecification || {}),
		paths
	};

	// console.log(JSON.stringify(schema, null, 4));

	// fs.writeFileSync(joinPaths(config.rootPath, 'schema', 'swaggerSchema.json'), JSON.stringify(schema, null, 4));
	fs.writeFileSync(joinPaths('schema', 'swaggerSchema.json'), JSON.stringify(schema, null, 4));
};

const generateRequestBody = (route: SingleRouteType) => {
	let inputSchema = {};

	if (route.schema!.input) {
		inputSchema = convertSqemaToSchema(route.schema!.input);
	}

	let requestBody;
	if (Object.keys(inputSchema).length > 0) {
		requestBody = {
			required: true,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: inputSchema
					}
				}
			}
		};
	}

	return requestBody;
};

const generateParameters = (route: SingleRouteType) => {
	const parameters: OpenAPIType.ParameterObject[] = [];
	const routeParts = route.path.split('/');

	for (const rp of routeParts) {
		if (rp.startsWith(':')) {
			parameters.push({
				name: rp.substr(1),
				in: 'path',
				required: true
			});
		}
	}

	return parameters;
};

const getSuccessResponse = (route: SingleRouteType) => {
	const dataSchema: OpenAPIType.SchemaObject = { type: 'object', properties: convertSqemaToSchema(route.schema!.output!.schema) };

	let schema: OpenAPIType.SchemaObject = { type: 'object', properties: {} };
	if (route.schema!.output!.messageKey !== undefined) {
		schema.properties![route.schema!.output!.messageKey] = {
			type: 'string'
		};
		route.schema!.output!.dataKey = route.schema!.output!.dataKey || 'data';
	}

	if (route.schema!.output!.dataKey !== undefined) {
		if (route.schema!.output!.isArray === true) {
			schema.properties![route.schema!.output!.dataKey] = {
				type: 'array',
				items: dataSchema
			};
		} else {
			schema.properties![route.schema!.output!.dataKey] = dataSchema;
		}
	} else {
		schema = dataSchema;
	}

	return {
		200: {
			description: '',
			content: {
				'application/json': {
					schema
				}
			}
		}
	};
};

const getNotFoundResponse = (route: SingleRouteType) => {
	const schema: OpenAPIType.ResponsesObject = {};
	if (route.schema?.output?.isArray === false && [ 'get', 'patch', 'put', 'delete' ].includes(route.method)) {
		schema[404] = {
			description: 'Data not found!'
		};
	}
	return schema;
};

const getValidationResponse = (route: SingleRouteType) => {
	const schema: OpenAPIType.ResponsesObject = {};
	if (route.validateBody === true) {
		schema[400] = {
			description: 'Invalid data passed!',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							message: {
								type: 'string'
							},
							errors: {
								type: 'object',
								properties: {
									key: {
										type: 'array',
										items: {
											type: 'string'
										}
									}
								}
							}
						}
					}
				}
			}
		};
	}
	return schema;
};

const generateResponses = (route: SingleRouteType) => {
	let responses: OpenAPIType.ResponsesObject = {};

	if (route.schema?.output) {
		responses = {
			...getSuccessResponse(route),
			...getNotFoundResponse(route),
			...getValidationResponse(route)
		};
	}

	return responses;
};

const generatePathsSchema = (route: SingleRouteType) => {
	if (route.schema) {
		const schema = {
			summary: route.name,
			requestBody: generateRequestBody(route),
			parameters: generateParameters(route),
			responses: generateResponses(route)
		};

		return {
			[route.method]: merge(schema, route.schema.customSpecification)
		};
	}
	return {};
};
