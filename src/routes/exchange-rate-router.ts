import '../config.ts';
import { Hono } from 'hono';
import { ExchangeRateController } from '../controllers/exchange-rate-controller.ts';
import { bearer } from '../middlewares/bearer.ts';

const ExchangeRateRouter = new Hono().basePath('/api/v1');
const controller = new ExchangeRateController();

ExchangeRateRouter.post('/exchange-rate/trigger', bearer, controller.trigger.bind(controller));

export { ExchangeRateRouter };
