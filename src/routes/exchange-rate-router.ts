import '../config.ts';
import { Hono } from 'hono';
import { ExchangeRateController } from '../controllers/exchange-rate-controller.ts';
import { bearer } from '../middlewares/bearer.ts';
import { ExchangeRate } from '../models/exchange-rate-model.ts';

const ExchangeRateRouter = new Hono().basePath('/api/v1');
const controller = new ExchangeRateController();

ExchangeRateRouter.post('/exchange-rates/trigger', bearer, controller.trigger.bind(controller));
ExchangeRateRouter.get('/exchange-rates', controller.getExchangeRates.bind(controller));

export { ExchangeRateRouter };
