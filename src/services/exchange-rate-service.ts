import { exchangeRateHandler } from '../crons/exchange-rate.ts';
import { logger } from '../logger.ts';
import { ExchangeRate, IExchangeRate } from '../models/exchange-rate-model.ts';

const model = new ExchangeRate();

interface Rates extends IExchangeRate {
	opposite_rate: number;
}

class ExchangeRateService {
	public async trigger(base: string) {
		return exchangeRateHandler(base).then((count) => {
			return { inserted: count };
		});
	}

	public async getExchangeRates(base: string, target: string) {
		const docs = await model.getExchangeRates(base, target);
		if (docs.length <= 0) {
			logger.warn(`No exchange rates found for ${base} to ${target}`);
			return [];
		}
		const rates: Rates[] = [];
		for (const doc of docs) {
			rates.push(Object.assign(doc.toJSON(), {
				opposite_rate: parseFloat((1 / parseFloat(doc.conversion_rate.toString())).toFixed(4)),
				conversion_rate: parseFloat(doc.conversion_rate.toString()),
			}));
		}
		return rates;
	}
}

export { ExchangeRateService };
