import config from '../../../config';
import type { ObjectType } from '../../../types/GenericTypes';
import { getFilesInDir, joinPaths } from '../../../utils/pathUtils';
import type { RouteInputSchemaType } from '../../../types/routeTypes/RouteSchemaTypes';

export const convertSqemaToSchema = (sqema: RouteInputSchemaType): ObjectType => {
	let properties: ObjectType = {};
	for (const is of sqema) {
		if ('table' in is || 'path' in is) {
			let path: string | undefined;
			if ('table' in is) {
				// path = joinPaths(config.rootPath, config.paths.schema, is.table);
				path = joinPaths(config.paths.schema, is.table!);
			} else if ('path' in is) {
				path = is.path;
			}

			if (is.fields === 'all') {
				for (let property of getFilesInDir(path!)) {
					property = property.split('.').shift() as string;
					if (!('exclude' in is) || !is.exclude?.includes(property)) {
						properties[property] = require(joinPaths(path!, property)).default;
					}
				}
			} else if (typeof is.fields === 'string') {
				properties[is.fields] = require(joinPaths(path!, is.fields)).default;
			} else if (Array.isArray(is.fields)) {
				for (const property of is.fields) {
					properties[property] = require(joinPaths(path!, property)).default;
				}
			}
		} else if ('schema' in is) {
			properties = { ...properties, ...is.schema };
		}
	}
	return properties;
};
