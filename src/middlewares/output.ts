import { Context, Next } from 'hono';
import { logger } from '../logger.ts';

export const output = async (ctx: Context, next: Next) => {
	try {
		const start = Date.now();
		logger.info(`${ctx.req.method} IN ${ctx.req.url}`);
		await next();
		logger.info(`${ctx.req.method} OUT ${ctx.req.url} ${ctx.res.status} ${Date.now() - start}ms`);
	} catch (err) {
		logger.error(err);
		ctx.status(500);
		ctx.json({
			code: 500,
			message: 'Internal Server Error',
		});
	}
};
