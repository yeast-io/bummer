import mongoose from 'npm:mongoose';

export interface IExchangeRate {
	base_code: string;
	target_code: string;
	conversion_rate: mongoose.Types.Decimal128;
	unique_ts: number;
	createdAt?: Date;
	updatedAt?: Date;
}

const schema = new mongoose.Schema<IExchangeRate>({
	base_code: { type: String, required: true },
	target_code: { type: String, required: true },
	// @ts-ignore - Types are incorrect
	conversion_rate: { type: mongoose.Types.Decimal128, required: true },
	unique_ts: { type: Number, required: true },
}, { timestamps: true });

schema.index({ base_code: 1 });
schema.index({ target_code: 1 });
schema.index({ unique_ts: 1 });
// @ts-ignore - Types are incorrect
schema.index({ base_code: 1, target_code: 1, unique_ts: 1 }, { unique: true });

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

	public async getExchangeRates(base: string, target: string) {
		return model.find({ base_code: base, target_code: target }).sort({ createdAt: 1 });
	}

	public decimal128(value: string) {
		if (!value || isNaN(Number(value))) {
			throw new Error('Invalid value');
		}
		// @ts-ignore - Types are incorrect
		return mongoose.Types.Decimal128.fromString(value);
	}
}
