import type KoaType from 'koa';
import type { Server as ServerType } from 'http';
import type { LoggerType, KoaRouterCreatorType } from '../../../types/DependencyTypes';
import {
	importKoa,
	importKoaBodyParser,
	importKoaLogger,
	importKoaRouterPackage
} from '../../../utils/importUtils/importPackageUtils';
import config from '../../../config';
import { importCustomRouter } from '../../../utils/importUtils/importProjectFileUtils';

class Server {
	private app: KoaType | undefined;

	private server: ServerType;

	public constructor(
		private readonly logger: LoggerType,
		private readonly router: KoaRouterCreatorType
	) {
	}

	public start = async () => {
		const Koa: typeof KoaType = await importKoa();
		this.app = new Koa();
		const bodyParser = await importKoaBodyParser();
		const Router = await importKoaRouterPackage();

		this.app.use(bodyParser()); // TODO: config
		if (config.isDev) {
			const koaLogger = await importKoaLogger();
			this.app.use(koaLogger()); // TODO: config
		}
		const mainRouter = new Router(); // Without prefix

		const customRouter = await importCustomRouter();
		if (customRouter) {
			customRouter(mainRouter, this.app);
		}

		const router = await this.router();
		mainRouter.use(router.routes());
		mainRouter.use(router.allowedMethods());
		this.app.use(mainRouter.routes());
		this.server = await this.app.listen(config.http.port, config.http.host, () => {
			this.logger.info(`Listening on port ${config.http.port}`);
		});
	};

	public stop = () => {
		this.server.close();
	};
}

export default Server;
