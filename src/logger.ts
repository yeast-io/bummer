import * as log from '@std/log';
import { sprintf } from 'https://esm.sh/sprintf-js@1.1.3';

log.setup({
	handlers: {
		default: new log.ConsoleHandler('INFO', {
			formatter: (record) => {
				const message = String(record.msg).charAt(0).toUpperCase() + String(record.msg).slice(1);
				return `${record.datetime.toISOString()} [${record.levelName}] - ${sprintf(message, ...record.args)}`;
			},
			useColors: true,
		}),
	},
});

export const logger = log.getLogger();
