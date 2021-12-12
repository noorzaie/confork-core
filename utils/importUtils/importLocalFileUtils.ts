import { importFromPath } from './index';

export const importExpressRouter = async () => {
	return importFromPath('../../src/interface/express/router');
};

export const importKoaRouter = async () => {
	return importFromPath('../../src/interface/koa/router');
};

export const importExpressServer = async () => {
	return importFromPath('../../src/interface/express/Server');
};

export const importKoaServer = async () => {
	return importFromPath('../../src/interface/koa/Server');
};
