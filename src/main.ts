import './config.ts';
import { Context, Hono } from 'hono';
import { connect } from './models/client.ts';
import { fatal, logger } from './logger.ts';
import { output } from './middlewares/output.ts';
import { exchangeRateHandler } from './crons/exchange-rate.ts';
import { ExchangeRateRouter } from './routes/exchange-rate-router.ts';

const app = new Hono();

// Connect to MongoDB
const connection = Deno.env.get('MONGODB_URI')
	? (await connect({ uri: Deno.env.get('MONGODB_URI') }))
	: (await connect({
		host: Deno.env.get('MONGODB_HOST'),
		port: Number(Deno.env.get('MONGODB_PORT')),
		dbName: Deno.env.get('MONGODB_DBNAME'),
	}));

app.use(output);

// Set up the application routes
app
	.get('/health-check', async (c: Context) => {
		return c.json({ code: 0, message: 'ok' });
	});

app.route('/', ExchangeRateRouter);

// Start the server
const server = Deno.serve({
	port: Number(Deno.env.get('HTTP_PORT')),
	onListen: ({ hostname, port }) => {
		logger.info(`Server started at http://${hostname}:${port}`);
		if (Deno.env.get('CRON_ENABLED') === 'false') {
			logger.info('Cron is disabled and overwritting Deno.cron');
			Deno.cron = (() => {}) as any;
		}
		Deno.cron('ExchangeRateHandler', '30 1 * * *', async () => {
			exchangeRateHandler('CNY');
		});
	},
}, app.fetch);

app.notFound((c: Context) => {
	return c.json({ code: 404, message: 'Not Found' }, 404);
});

app.onError((err: Error, c: Context) => {
	logger.error('Unhandled Error Occurred');
	logger.error(err);
	return c.json({
		code: 500,
		message: 'Server Internal Error',
	}, 500);
});

export { app, connection, server };
