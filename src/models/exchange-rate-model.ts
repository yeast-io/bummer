import mongoose from 'npm:mongoose';

export interface IExchangeRate {
	base_code: string;
	target_code: string;
	conversion_rate: mongoose.Types.Decimal128;
	createdAt?: Date;
	updatedAt?: Date;
}

const schema = new mongoose.Schema<IExchangeRate>({
	base_code: { type: String, required: true },
	target_code: { type: String, required: true },
	conversion_rate: { type: mongoose.Types.Decimal128, required: true },
}, { timestamps: true });

schema.index({ base_code: 1 });
schema.index({ target_code: 1 });

const model = mongoose.model<IExchangeRate>('ExchangeRate', schema);

export class ExchangeRate {
	public async setConversionRates(rates: IExchangeRate[]) {
		if (rates.length <= 0) {
			return 0;
		}
		return model.bulkWrite(rates.map((rate) => ({
			insertOne: {
				document: rate,
			},
		}))).then((result) => result.insertedCount);
	}

	public decimal128(value: string) {
		if (!value || isNaN(Number(value))) {
			throw new Error('Invalid value');
		}
		// @ts-ignore - Types are incorrect
		return mongoose.Types.Decimal128.fromString(value);
	}
}
