import type { AwilixContainer } from 'awilix';
import { asValue } from 'awilix';
import type { BaseUseCase } from '../../application/BaseUseCase';
import type { ObjectType, RequestType } from '../../../types/GenericTypes';
import type { ActionInputHandlersType } from '../../../types/routeTypes/ActionInputHandlerTypes';
import { extractDataFromPath } from '../../../utils/pathUtils';
import type { DBType } from '../../../types/DependencyTypes';
import type { ConditionSourceType, ConditionType, CompareOperatorsType } from '../../../types/ConditionTypes';
import type { ActionType } from '../../../types/routeTypes/ActionTypes';
import config from '../../../config';

const getDataFromSource = (source: ConditionSourceType, path: string, req: RequestType, steps: ObjectType, container: AwilixContainer) => {
	let data;
	if (source === 'step') {
		const pathParts = path.split('.');
		data = steps[pathParts.shift() as string];
		data = extractDataFromPath(pathParts.join('.'), data);
	} else if (source === 'container') {
		const pathParts = path.split('.');
		data = steps[pathParts.shift() as string];
		data = container.resolve(pathParts.shift() as string);
		data = extractDataFromPath(pathParts.join('.'), data);
	} else if (source === 'request') {
		data = extractDataFromPath(path, req);
	} else if (source === 'fixed') {
		data = path;
	}
	return data;
};

const compareValues = (left: any, right: any, operator: CompareOperatorsType): boolean => {
	if (operator === 'eq') {
		return left === right;
	}
	if (operator === 'neq') {
		return left !== right;
	}
	if (operator === 'in') {
		return right.includes(left);
	}
	if (operator === 'nin') {
		return !right.includes(left);
	}
	return false;
};

export const checkConditions = (conditions: ConditionType, req: RequestType, steps: ObjectType, container: AwilixContainer): boolean => {
	if ('conditions' in conditions) {
		let matches;
		for (const condition of conditions.conditions!) {
			matches = checkConditions(condition, req, steps, container);
			if (conditions.operator === 'and' && !matches) {
				return false;
			}
			if (conditions.operator === 'or' && matches) {
				return true;
			}
		}
		return true;
	}
	const { rightSource, rightPath, leftSource, leftPath, operator } = conditions;
	const rightData = getDataFromSource(rightSource, rightPath, req, steps, container);
	const leftData = getDataFromSource(leftSource, leftPath, req, steps, container);
	return compareValues(leftData, rightData, operator);
};

const injectInputs = (req: RequestType, inputs: ActionInputHandlersType, stepHandler: string, steps: ObjectType) => {
	let data = {};
	for (const { handler, args } of inputs) {
		data = { ...data, ...req.scope.resolve(`actionInputHandlers.${handler}`)({ req, steps }, ...args) };
	}
	req.scope.register({
		// @ts-ignore
		[stepHandler]: req.scope.registrations[stepHandler].inject(() => (data))
	});
};

const getScopeContainer = async (container: AwilixContainer, req: RequestType, startTransaction?: boolean, endTransaction?: boolean) => {
	let connection;
	const db: DBType = container.resolve('DB');
	let transactionConnections = req.scope.hasRegistration('transactionConnections') ? req.scope.resolve('transactionConnections') : [];

	if (endTransaction === true) {
		const transactionConnection = container.resolve('connection');
		await db.commitTransaction(transactionConnection);
		transactionConnections = transactionConnections.filter((tc: any) => tc !== transactionConnection);
		connection = db.getConnection();
		container = container.createScope();
	}

	if (startTransaction === true) {
		connection = await db.startTransaction();
		container = container.createScope();
		transactionConnections = [ ...transactionConnections, connection ];
	} else if (!container.hasRegistration('connection')) {
		connection = db.getConnection();
		container = container.createScope();
	}

	if (connection) {
		container.register({
			connection: asValue(connection)
		});
	}

	req.scope.register({
		transactionConnections: asValue(transactionConnections)
	});

	return container;
};

export const executeRouteActions = async (actions: ActionType[], successCode: number | undefined, req: RequestType, falseConditionCallback: Function) => {
	const stepResults: ObjectType = {};
	let container = req.scope;
	const promises = [];

	for (const [ , { conditions, handler, inputs, falseConditionHandler, keepResponse, name, async, startTransaction, endTransaction } ] of actions.entries()) {
		let matches = true;
		if (conditions) {
			matches = checkConditions(conditions, req, stepResults, req.scope);
		}

		if (matches) {
			if (inputs) {
				injectInputs(req, inputs, handler, stepResults);
			}

			if (config.hasDb && container.hasRegistration('DB')) {
				container = await getScopeContainer(container, req, startTransaction, endTransaction);
			}

			const useCase: BaseUseCase = container.resolve(handler, { allowUnregistered: false });

			if (async === true) {
				const p = useCase.execute();
				p
					.then(result => {
						// console.log('result', name, result);
						if (keepResponse && name) {
							stepResults[name] = result;
						}
					});
				promises.push(p);
			} else {
				if (promises.length > 0) {
					await Promise.all(promises);
					promises.length = 0;
				}
				const result = await useCase.execute();
				// console.log('result', name, result);
				if (keepResponse && name) {
					stepResults[name] = result;
				}
			}
		} else if (falseConditionHandler) {
			falseConditionCallback(falseConditionHandler);
		}
	}

	if (promises.length > 0) {
		await Promise.all(promises);
	}

	if (req.scope.hasRegistration('transactionConnections')) {
		const db = req.scope.resolve('DB');
		for (const tc of req.scope.resolve('transactionConnections')) {
			await db.commitTransaction(tc);
		}
	}

	return stepResults;
};
