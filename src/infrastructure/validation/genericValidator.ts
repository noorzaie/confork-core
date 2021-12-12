import type { AjvValidateOptionsType, ObjectType } from '../../../types/GenericTypes';
import type { BaseValidatorType, GenericValidatorType } from '../../../types/DependencyTypes';

export default (baseValidator: BaseValidatorType): GenericValidatorType => (properties: ObjectType, options?: AjvValidateOptionsType) => {
	const required = [];
	if (!options || !Object.prototype.hasOwnProperty.call(options, 'required')) {
		for (const [ property, schema ] of Object.entries(properties)) {
			if (!schema.nullable && !Object.prototype.hasOwnProperty.call(schema, 'default')) {
				required.push(property);
			}
		}
	}

	const schema = {
		type: 'object',
		properties,
		required,
		additionalProperties: false,
		...options
	};

	return baseValidator(schema as any);
};
