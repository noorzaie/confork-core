import type { Request, Response } from 'express';
import type { EdgeResponseHandlersType } from '../../../../types/routeTypes/EdgeResponseHandlerTypes';
import type { RouteResponseHandlersType } from '../../../../types/routeTypes/ResponseHandlerTypes';
import type { ActionFalseConditionHandlersType, ActionType } from '../../../../types/routeTypes/ActionTypes';
import { executeRouteActions } from '../../utils/routeActionsUtil';
import type { CompiledValidatorType } from '../../../../types/DependencyTypes';

const handleFalseCondition = (handler: ActionFalseConditionHandlersType, req: Request, res: Response) => {
	req.scope.resolve(`falseConditionHandlers.${handler.handler}`)(handler.args, req, res);
};

export const handleRequest = (actions: ActionType[], validateBody: boolean | undefined, validator: CompiledValidatorType | undefined, successCode: number | undefined, responseHandler: RouteResponseHandlersType, edgeResponseHandler: EdgeResponseHandlersType | undefined) => async (req: Request, res: Response) => {
	if (validateBody && validator) {
		validator(req.body);
	}
	const actionResults = await executeRouteActions(
		actions,
		successCode,
		req,
		(falseConditionHandler: ActionFalseConditionHandlersType) => handleFalseCondition(falseConditionHandler, req, res)
	);

	if (Object.keys(actionResults).length === 0) {
		res.send({});
	} else {
		const finalResult = req.scope.resolve(`responseHandlers.${responseHandler.handler}`)(
			responseHandler.args as any,
			actionResults,
			req
		);

		res.status(successCode || 200);
		if (edgeResponseHandler) {
			req.scope.resolve(`edgeResponseHandlers.${edgeResponseHandler.handler}`)(
				edgeResponseHandler.args,
				req.scope.resolve('LocaleService'),
				finalResult,
				req,
				res
			);
		} else {
			res.send(finalResult);
		}
	}
};
