export const importFromPath = (path: string, defaultValue?: any, getDefault = true): any => {
	// console.log('importing', path);
	return import(`${path}`)
		.then(module => {
			// console.log('module imported', module);
			return getDefault ? module.default : module;
		})
		.catch(error => {
			// console.log(`import error ${path}`, error);
			if (defaultValue === undefined) {
				console.log(`Confork: error importing module ${path}`, error);
				throw error;
			} else {
				console.log(`Confork: module ${path} not found, returning default value.`);
				return defaultValue;
			}
		});
};
