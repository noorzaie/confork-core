import type { Context } from 'koa';
import type { EdgeResponseHandlersType } from '../../../../types/routeTypes/EdgeResponseHandlerTypes';
import type { RouteResponseHandlersType } from '../../../../types/routeTypes/ResponseHandlerTypes';
import type { ActionFalseConditionHandlersType, ActionType } from '../../../../types/routeTypes/ActionTypes';
import { executeRouteActions } from '../../utils/routeActionsUtil';
import type { CompiledValidatorType } from '../../../../types/DependencyTypes';

const handleFalseCondition = (handler: ActionFalseConditionHandlersType, ctx: Context) => {
	ctx.request.scope.resolve(`falseConditionHandlers.${handler.handler}`)(handler.args, ctx);
};

export const handleRequest = (actions: ActionType[], validateBody: boolean | undefined, validator: CompiledValidatorType | undefined, successCode: number | undefined, responseHandler: RouteResponseHandlersType, edgeResponseHandler: EdgeResponseHandlersType | undefined) => async (ctx: Context) => {
	if (validateBody && validator) {
		validator(ctx.request.body);
	}
	const actionResults = await executeRouteActions(
		actions,
		successCode,
		ctx.request,
		(falseConditionHandler: ActionFalseConditionHandlersType) => handleFalseCondition(falseConditionHandler, ctx)
	);

	if (Object.keys(actionResults).length === 0) {
		ctx.body = {};
	} else {
		const finalResult = ctx.request.scope.resolve(`responseHandlers.${responseHandler.handler}`)(
			responseHandler.args as any,
			actionResults,
			ctx.request
		);

		ctx.response.status = successCode || 200;
		if (edgeResponseHandler) {
			ctx.request.scope.resolve(`edgeResponseHandlers.${edgeResponseHandler.handler}`)(
				edgeResponseHandler.args,
				ctx.request.scope.resolve('LocaleService'),
				finalResult,
				ctx
			);
		} else {
			ctx.body = finalResult;
		}
	}
};
