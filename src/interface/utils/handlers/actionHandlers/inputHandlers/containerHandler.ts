import type { ContainerHandlerArgsType, ActionInputHandlerSourceArgType, ActionInputHandlerType } from '../../../../../../types/routeTypes/ActionInputHandlerTypes';
import type { ObjectType } from '../../../../../../types/GenericTypes';
import { setDataFromPath } from '../../../../../../utils/pathUtils';

const containerHandler: ActionInputHandlerType = (
	{ req }: ActionInputHandlerSourceArgType, { fromKey, toKey, options }: ContainerHandlerArgsType
) => {
	const pathParts = fromKey.split('.');
	// First part of path is key name in container
	const data: ObjectType = { [toKey]: req.scope.resolve(pathParts.shift() as string, options) };
	if (pathParts.length > 0) {
		setDataFromPath(pathParts.join('.'), toKey, data, data);
	}
	return data;
};

export default containerHandler;
