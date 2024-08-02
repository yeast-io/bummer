import { load } from '@std/dotenv';
import { logger } from './logger.ts';

export const env = await load({ export: true });

for (const [key, value] of Object.entries(env)) {
	logger.info(`Setting ${key}=${value}`);
	Deno.env.set(key, value);
}

Deno.env.set('EXCHANGE_RATE_API', 'https://v6.exchangerate-api.com/v6/{{key}}/latest/{{base}}');
