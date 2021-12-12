import type { AwilixContainer } from 'awilix';
import type { Context, Next } from 'koa';

export default (container: AwilixContainer) => async (ctx: Context, next: Next) => {
	ctx.request.scope = container.createScope();
	await next();
};
