import mongoose from 'npm:mongoose';
import { logger } from '../logger.ts';

export interface Options {
	uri?: string;
	dbName?: string;
	user?: string;
	pass?: string;
	host?: string;
	port?: number;
	syncIndexes?: boolean;
}

const cluster = async (uri: string) => {
	return mongoose.connect(uri);
};

const sentinel = async (options: Options) => {
	const uri = options.user && options.pass
		? `mongodb://${options.user}:${options.pass}@${options.host}:${options.port}/${options.dbName}`
		: `mongodb://${options.host}:${options.port}/${options.dbName}`;

	(<any> mongoose.connection).on('connecting', () => {});
	(<any> mongoose.connection).on('connected', () => {
		logger.info(
			'Connection has been established on uri mongodb://%s:%s/%s',
			options.host,
			options.port,
			options.dbName,
		);
		if (options.syncIndexes) {
			mongoose.syncIndexes()
				.then((resultObj) => {
					logger.info('=================== Sync Indexes =================');
					for (const key in resultObj) {
						logger.info('%s -> %j', key, resultObj[key]);
					}
					logger.info('================ Sync Indexes Done ===============');
				})
				.catch((err) => logger.info('SyncIndexes Error:', err));
		}
	});
	(<any> mongoose.connection).on('disconnected', () => {
		logger.info(
			'connection has been disconnected from mongodb://%s:%s/%s',
			options.host,
			options.port,
			options.dbName,
		);
	});
	// Cast 'mongoose.connection' to 'any' type to bypass type checking
	(<any> mongoose.connection).on('reconnected', () => {});
	(<any> mongoose.connection).on('error', (err: Error) => logger.error(err));
	return mongoose.connect(uri);
};

export const connect = async (options: Options) => {
	options.host = options.host || '127.0.0.1';
	options.port = options.port || 27017;

	if (options?.uri) {
		return cluster(options.uri);
	}

	return sentinel(options);
};
