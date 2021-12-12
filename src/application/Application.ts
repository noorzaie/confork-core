import type { DBType, LoggerType, ServerType } from '../../types/DependencyTypes';
import config from '../../config';

class Application {
	private Server;

	private logger;

	private db;

	public constructor(Server: ServerType, DB: DBType | undefined = undefined, logger: LoggerType) {
		this.Server = Server;
		this.logger = logger;
		this.db = DB;
	}

	public start = async () => {
		if (config.hasDb && this.db) {
			await (this.db as DBType).connect();
		}

		await this.Server.start();
	};

	public stop = async () => {
		if (config.hasDb && this.db) {
			await this.db.stop();
		}
		this.Server.stop();
	}
}

export default Application;
