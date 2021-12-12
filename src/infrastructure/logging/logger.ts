import { createLogger, transports, format } from 'winston';
import type { LoggerOptions } from 'winston';
import fs from 'fs';
import colors from 'colors';
import type { EnvType } from '../../../types/GenericTypes';

const { combine, timestamp, errors, simple, printf } = format;

if (!fs.existsSync('logs')) {
	fs.mkdirSync('logs');
}

const loggerCreator = (env: EnvType, config: LoggerOptions) => {
	const logger = createLogger({
		format: combine(timestamp(), errors({ stack: true }), simple()),
		exitOnError: false,
		transports: [
			new transports.File({
				filename: `logs/${env}-errors.log`,
				level: 'error'
			}),
			new transports.File({
				filename: `logs/${env}.log`
			})
		],
		...config
	});

	if (env !== 'production') {
		const objectStringFormat = printf((info) => {
			const { level, stack } = info;
			let { message } = info;

			if (message) {
				if (typeof message === 'object') {
					message = JSON.stringify(message);
				}
			}

			switch (level) {
				case 'warn':
					return colors.yellow(`[${level}] ${message}`);
				case 'http':
					return colors.magenta(`[${level}] ${message}`);
				case 'error':
					return colors.red(`[${level}] ${message}\n ${stack || ''}`);
				case 'verbose':
					return colors.white(`[${level}] ${message}`);
				case 'info':
					return colors.green(`[${level}] ${message}`);
				case 'debug':
					return colors.blue(`[${level}] ${message}`);
				default:
					return colors.dim(`[${level}] ${message}`);
			}
		});
		logger.add(
			new transports.Console({
				format: combine(timestamp(), objectStringFormat)
			})
		);
	}

	return logger;
};

export default loggerCreator;
