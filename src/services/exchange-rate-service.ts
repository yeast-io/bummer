import { exchangeRateHandler } from '../crons/exchange-rate.ts';

class ExchangeRateService {
	public async trigger(base: string) {
		return exchangeRateHandler(base).then((count) => {
			return { inserted: count };
		});
	}
}

export { ExchangeRateService };
