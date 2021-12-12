import type Express from 'express';
import type { Server as ServerType } from 'http';
import type { LoggerType, ExpressRouterCreatorType } from '../../../types/DependencyTypes';
import config from '../../../config';
import { importExpress, importMorgan } from '../../../utils/importUtils/importPackageUtils';
import { importCustomRouter } from '../../../utils/importUtils/importProjectFileUtils';

class Server {
	private app: Express.Express | undefined;

	private server: ServerType;

	public constructor(
		private readonly logger: LoggerType,
		private readonly router: ExpressRouterCreatorType
	) {
	}

	public start = async () => {
		const express: typeof Express = await importExpress();
		this.app = express();
		this.app.use(express.json()); // TODO config
		if (config.isDev) {
			const morgan = await importMorgan();
			this.app.use(morgan('combined')); // TODO config
		}
		const router = await this.router();
		this.app.use(config.http.basePath || '/', router as Express.Router);

		const customRouter = await importCustomRouter();
		if (customRouter) {
			customRouter(router, this.app);
		}

		this.server = await this.app.listen(config.http.port, config.http.host, () => {
			this.logger.info(`Listening on port ${config.http.port}`);
		});
	};

	public stop = () => {
		this.server.close();
	};
}

export default Server;
