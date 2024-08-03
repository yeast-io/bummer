import { Context } from 'hono';
import { ExchangeRateService } from '../services/exchange-rate-service.ts';
import { logger } from '../logger.ts';

const service = new ExchangeRateService();

class ExchangeRateController {
	public async trigger(c: Context) {
		try {
			const base = c.req.query('base') || 'CNY';
			const data = await service.trigger(base);
			return c.json({ code: 0, message: 'ok', data });
		} catch (err) {
			logger.error(err);
			return c.json({ code: 500, message: 'Server Internal Error' }, 500);
		}
	}
}

export { ExchangeRateController };
