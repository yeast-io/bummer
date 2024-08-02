import './config.ts';
import { Context, Hono } from 'hono';
import { connect } from './models/client.ts';
import { logger } from './logger.ts';
import { output } from './middlewares/output.ts';
import { exchangeRateHandler } from './crons/exchange-rate.ts';

const app = new Hono();

// Connect to MongoDB
const connection = await connect({
	host: Deno.env.get('MONGODB_HOST'),
	port: Number(Deno.env.get('MONGODB_PORT')),
	dbName: Deno.env.get('MONGODB_DBNAME'),
});

app.use(output);

// Set up the application routes
app
	.get('/health-check', async (c: Context) => {
		return c.json({ code: 0, message: 'ok' });
	});

// Start the server
const server = Deno.serve({
	port: Number(Deno.env.get('HTTP_PORT')),
	onListen: ({ hostname, port }) => {
		logger.info(`Server started at http://${hostname}:${port}`);
		Deno.cron('ExchangeRateHandler', '30 1 * * *', async () => {
      exchangeRateHandler('CNY');
    });
	},
}, app.fetch);

app.notFound((c: Context) => {
	return c.text('Not Found', 404);
});

app.onError((err: Error, c: Context) => {
	logger.error('UncaughtError', err.stack);
	return c.text(err.message, 500);
});

export { app, connection, server };
