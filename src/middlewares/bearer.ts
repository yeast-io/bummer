import '../config.ts';
import { bearerAuth } from 'hono/bearer-auth';
import { Context, Next } from 'hono';
import { logger } from '../logger.ts';

const auth = bearerAuth({ token: Deno.env.get('BEARER_AUTH_TOKEN') as string });

export const bearer = async (c: Context, next: Next) => {
	try {
		await auth(c, next);
	} catch (err) {
		logger.error('Bearer Unauthorized');
		logger.error(err);
		return c.json({ code: 401, message: 'Unauthorized' }, 401);
	}
};
