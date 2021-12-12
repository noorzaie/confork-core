import { extractDataFromPath, setDataToPath } from '../../../../../../utils/pathUtils';
import type { ActionInputHandlerSourceArgType, ActionInputHandlerType, StepInputHandlerArgsType } from '../../../../../../types/routeTypes/ActionInputHandlerTypes';
import type { ObjectType } from '../../../../../../types/GenericTypes';

const stepHandler: ActionInputHandlerType = (
	{ steps }: ActionInputHandlerSourceArgType, ...args: StepInputHandlerArgsType[]
) => {
	const data = {};
	for (const { fromKey, toKey, name, default: defaultValue } of args) {
		let extracted;
		if (fromKey) {
			extracted = extractDataFromPath(fromKey, steps.find((item: ObjectType) => item.name === name));
		} else {
			// Whole step
			extracted = steps.find((item: ObjectType) => item.name === name);
		}

		extracted = extracted === undefined && defaultValue !== undefined ? defaultValue : extracted;
		setDataToPath(toKey, data, extracted);
	}
	return data;
};

export default stepHandler;
