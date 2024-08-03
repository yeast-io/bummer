import { exchangeRateHandler } from '../crons/exchange-rate.ts';
import { logger } from '../logger.ts';
import { ExchangeRate } from '../models/exchange-rate-model.ts';

const model = new ExchangeRate();

class ExchangeRateService {
	public async trigger(base: string) {
		return exchangeRateHandler(base).then((count) => {
			return { inserted: count };
		});
	}

	public async getExchangeRates(base: string, target: string) {
		return model.getExchangeRates(base, target);
	}
}

export { ExchangeRateService };
