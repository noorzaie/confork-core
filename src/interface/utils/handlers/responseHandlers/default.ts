import type { AwilixContainer } from 'awilix';
import type { ObjectType, RequestType } from '../../../../../types/GenericTypes';
import { isObject } from '../../../../../utils/objectUtils';
import type {
	ChildFieldGroupType,
	ChildFieldType,
	ChildSchemaType,
	FieldGroupType,
	FieldType,
	PluralSchemaType,
	ResultFieldsType,
	SingularSchemaType
} from '../../../../../types/routeTypes/ResponseHandlerTypes';
import { checkConditions } from '../../routeActionsUtil';

const formatDataWithFields = (
	rawData: ObjectType,
	fields: (ChildFieldType | ChildFieldGroupType | FieldType | FieldGroupType)[],
	req: RequestType,
	steps: ObjectType,
	container: AwilixContainer
): ObjectType => {
	const data = {};
	for (const field of fields) {
		if ('fields' in field) {
			// Handle group of fields
			if (field.conditions === undefined || checkConditions(field.conditions!, req, steps, container)) {
				let currentRawData = rawData;
				if ('step' in field) {
					currentRawData = currentRawData[field.step!];
				}
				if ('fromKey' in field) {
					currentRawData = currentRawData[field.fromKey!];
				}
				for (const f of field.fields) {
					setDataToObject(currentRawData, data, f, req, steps, container);
				}
			}
		} else {
			setDataToObject('step' in field ? rawData[field.step as keyof typeof rawData] : rawData, data, field, req, steps, container);
		}
	}
	return data;
};

const setDataToObject = (
	rawData: ObjectType,
	formattedData: ObjectType,
	field: FieldType | ChildFieldType | string,
	req: RequestType,
	steps: ObjectType,
	container: AwilixContainer
) => {
	if (rawData !== undefined && rawData !== null) { // If field exists on data
		if (isObject(field)) {
			if (field.conditions === undefined || checkConditions(field.conditions!, req, steps, container)) {
				if (rawData[field.fromKey] === null || rawData[field.fromKey] === undefined) {
					formattedData[field.toKey] = rawData[field.fromKey]; // If nested object is null, don't parse it anymore
				} else if (field.childes !== undefined) { // Nested field
					formattedData[field.toKey] = formatDataWithSchema(rawData[field.fromKey], field.childes, req, steps, container);
				} else {
					formattedData[field.toKey] = rawData[field.fromKey];
				}
			}
		} else { // String keys
			formattedData[field] = rawData[field];
		}
	}
};

// Separate plural or singular data
const formatDataWithSchema = (
	rawData: ObjectType | Array<ObjectType>,
	fields: SingularSchemaType | PluralSchemaType | ChildSchemaType,
	req: RequestType,
	steps: ObjectType,
	container: AwilixContainer
) => {
	if (fields.plural) {
		return ('step' in fields ? (rawData as ObjectType)[fields.step] : rawData as Array<ObjectType>)
			.map((rd: ObjectType) => formatDataWithFields(rd, fields.schema, req, steps, container));
	}
	return formatDataWithFields(rawData, fields.schema, req, steps, container);
};

export default (args: ResultFieldsType, steps: ObjectType, req: RequestType): any => {
	return formatDataWithSchema(steps, args, req, steps, req.scope);
};
