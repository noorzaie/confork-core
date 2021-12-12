import { asValue } from 'awilix';
import { registerDependencies, container } from './dependencyContainer';
import { loadConforkrc } from '../utils/importUtils/importProjectFileUtils';
import type { ApplicationType } from '../types/DependencyTypes';

export const run = async () => {
	console.log('   ______            ____           __\n'
		+ '  / ____/___  ____  / __/___  _____/ /__\n'
		+ ' / /   / __ \\/ __ \\/ /_/ __ \\/ ___/ //_/\n'
		+ '/ /___/ /_/ / / / / __/ /_/ / /  / ,<\n'
		+ '\\____/\\____/_/ /_/_/  \\____/_/  /_/|_|\n'
		+ '\n');

	return loadConforkrc()
		.then(() => {
			return registerDependencies()
				.then(() => {
					const app: ApplicationType = container.resolve('Application');
					return app.start()
						.then(() => {
							if (container.hasRegistration('DB')) {
								container.register({ connection: asValue(container.resolve('DB').getConnection()) });
							}
							container.resolve('logger').info('App started successfully!');
						})
						.catch(error => {
							console.error('Error starting app!', error);
							app.stop();
						});
				})
				.catch(error => {
					console.error('Error registering dependencies!', error);
				});
		})
		.catch(error => {
			console.error('Error loading dependencies!', error);
		});
};
