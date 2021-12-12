import type { Context, Next } from 'koa';

export default (callback: Function) => (ctx: Context, next: Next) => callback(ctx.request, ctx.response, next);
