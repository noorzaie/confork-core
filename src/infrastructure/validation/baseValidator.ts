import type { JSONSchemaType, ErrorObject } from 'ajv';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type { BaseValidatorType, LocaleServiceType, LoggerType } from '../../../types/DependencyTypes';
import type { ValidationErrorsType } from '../../../types/GenericTypes';
import ValidationError from '../../../utils/error/ValidationError';
import { importAjvConfig } from '../../../utils/importUtils/importProjectFileUtils';

export default async () => {
	const ajvConfig = await importAjvConfig();
	const ajv = new Ajv(ajvConfig.options);
	addFormats(ajv);

	return (LocaleService: LocaleServiceType, logger: LoggerType): BaseValidatorType => (schema: JSONSchemaType<unknown>, options: { resourcePath?: string; } = {}) => {
		const validator = ajv.compile(schema);

		return (data: any) => {
			if (!validator(data)) {
				if (ajvConfig.translateErrors && validator.errors !== null) {
					const errors: ValidationErrorsType = {};
					for (const error of validator.errors as ErrorObject[]) {
						let param;
						if (error.instancePath) {
							param = error.instancePath.substr(1);
							if (error.params.missingProperty) {
								param = `${param}.${error.params.missingProperty}`;
							}
						} else {
							param = error.params.missingProperty;
						}

						if (!errors[param]) {
							errors[param] = [];
						}
						logger.error(error);
						errors[param].push(
							LocaleService.translate(
								`validation.${error.keyword}`,
								{
									...error.params,
									resource: `${options.resourcePath || 'resources'}.${param}`,
									allowedValues: error.params.allowedValues ? `(${error.params.allowedValues.join(',')})` : undefined,
									isAjv: true
								}
							)
						);
					}
					throw new ValidationError(errors);
				} else {
					throw new ValidationError(validator.errors as ErrorObject[]);
				}
			}
		};
	};
};
