import { setDataFromPath } from '../../../../../../utils/pathUtils';
import type { ActionInputHandlerSourceArgType, ActionInputHandlerType, RequestHandlerArgsType } from '../../../../../../types/routeTypes/ActionInputHandlerTypes';
import type { ObjectType } from '../../../../../../types/GenericTypes';

const requestHandler: ActionInputHandlerType = ({ req }: ActionInputHandlerSourceArgType, ...args: RequestHandlerArgsType[]) => {
	const data: ObjectType = {};
	for (const { fromKey, toKey, default: defaultValue, parser } of args) {
		setDataFromPath(fromKey, toKey, req, data, defaultValue, parser);
	}
	return data;
};

export default requestHandler;
