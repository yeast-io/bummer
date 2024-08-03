import '../config.ts';
import { logger } from '../logger.ts';
import { ExchangeRate, IExchangeRate } from '../models/exchange-rate-model.ts';

const model = new ExchangeRate();

export const getExchangeRates = async (base: string) => {
	const url: string = (Deno.env.get('EXCHANGE_RATE_API') || '')
		?.replace('{{key}}', Deno.env.get('EXCHANGE_RATE_API_KEY') as string)
		?.replace('{{base}}', base);
	const response = await fetch(url);
	return response.json();
};

export const exchangeRateHandler = async (base: string) => {
	if (!base) {
		logger.error(new Error('Base currency is required'));
		return null;
	}

	const data = await getExchangeRates(base);
	if (data.result !== 'success') {
		logger.warn(`Failed to fetch exchange rates for ${base}`);
		return null;
	}

	const documents: IExchangeRate[] = [];
	for (const [target_code, conversion_rate] of Object.entries(data.conversion_rates)) {
		logger.info(`Setting exchange rate ${base} to ${target_code} as ${conversion_rate}`);
		// Save the exchange rate to MongoDB
		if (target_code === base) {
			continue;
		}

		documents.push({
			base_code: base,
			target_code,
			conversion_rate: model.decimal128(String(conversion_rate)),
			createdAt: new Date(data.time_last_update_utc),
		});
	}

	const count = await model.setConversionRates(documents);
	logger.info(`Saved ${count} exchange rates to MongoDB`);
	return count;
};
