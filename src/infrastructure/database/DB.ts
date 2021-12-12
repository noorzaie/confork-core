import type { Connection, QueryRunner } from 'typeorm';
import { importTypeorm } from '../../../utils/importUtils/importPackageUtils';
import config from '../../../config';
import type { DatabaseType } from '../../../types/DependencyTypes';

class DB implements DatabaseType {
	private connection: Connection | undefined;

	public connect = async () => {
		const { createConnection } = await importTypeorm();
		return createConnection({
			type: config.db.dialect,
			host: config.db.host,
			port: config.db.port,
			username: config.db.username,
			password: config.db.password,
			database: config.db.database,
			logging: config.env === 'development',
			...(config.db.otherDbOptions || {})
		})
			.then(connection => {
				this.connection = connection;
			});
	}

	public startTransaction = async () => {
		const queryRunner: QueryRunner = this.connection!.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		return queryRunner;
	}

	public commitTransaction = async (queryRunner: QueryRunner | Connection | undefined) => {
		if (queryRunner && 'commitTransaction' in queryRunner) {
			await queryRunner.commitTransaction();
			await queryRunner.release();
		}
	}

	public rollbackTransaction = async (queryRunner: QueryRunner | Connection | undefined) => {
		if (queryRunner && 'rollbackTransaction' in queryRunner) {
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
		}
	}

	public getConnection = () => this.connection;

	public stop = async () => {
		await this.connection?.close();
	}
}

export default DB;
