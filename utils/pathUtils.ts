import path from 'path';
import fs from 'fs';
import { path as rootPath } from 'app-root-path';
import type { ObjectType } from '../types/GenericTypes';
import parserHandlers from './parseHandlers';
import type { ParseHandlerTypes } from '../types/ParseHandlerTypes';

export const extractDataFromPath = (givenPath: string, data: ObjectType, defaultValue?: any, parser?: ParseHandlerTypes) => {
	const fromParts = givenPath.split('.');

	// Extract data from specified path
	let extracted: ObjectType | any = data;
	for (const pp of fromParts) {
		extracted = (extracted as ObjectType)[pp];
	}

	// Set default value
	extracted = extracted === undefined && defaultValue !== undefined ? defaultValue : extracted;

	// Convert 'null' to null
	if (parser) {
		extracted = parserHandlers[parser](extracted);
	}

	return extracted;
};

export const setDataToPath = (givenPath: string, targetData: any, dataToSet: any) => {
	const toParts = givenPath.split('.');
	const targetKey: string = toParts.pop() as string; // Pop last part of path and set final value to it

	// Go to nested part of target data
	for (const tp of toParts) {
		if (!Object.prototype.hasOwnProperty.call(targetData, tp)) {
			targetData[tp] = {};
		}
		targetData = targetData[tp];
	}
	targetData[targetKey] = dataToSet;
};

export const setDataFromPath = (from: string, to: string, fromData: ObjectType, toData: ObjectType, defaultValue?: any, parser?: ParseHandlerTypes) => {
	const extracted = extractDataFromPath(from, fromData, defaultValue, parser);
	setDataToPath(to, toData, extracted);
};

export const joinPaths = (...paths: string[]): string => {
	return path.join(...paths);
};

export const getFilesInDir = (givenPath: string): string[] => {
	return fs.readdirSync(givenPath).filter(file => [ 'ts', 'js' ].includes(file.split('.').slice(1).join('.')));
};

export const mergeUris = (startPrefix?: string, endPrefix?: string): string => {
	if (endPrefix) {
		if (endPrefix.startsWith('/')) {
			endPrefix = endPrefix.substr(1);
		}
		if (endPrefix.endsWith('/')) {
			endPrefix = endPrefix.substr(0, endPrefix.length - 1);
		}
	}
	if (startPrefix) {
		if (startPrefix.startsWith('/')) {
			startPrefix = startPrefix.substr(1);
		}
		if (startPrefix.endsWith('/')) {
			startPrefix = startPrefix.substr(0, startPrefix.length - 1);
		}
	}
	return startPrefix ? endPrefix ? `/${startPrefix}/${endPrefix}` : `/${startPrefix}` : endPrefix ? `/${endPrefix}` : '';
};

export const getRootPath = (): string => {
	return rootPath;
};
