import parseBoolean from './parseBoolean';
import parseNull from './parseNull';
import parseFloat from './parseFloat';
import parseInt from './parseInt';

export default {
	boolean: parseBoolean,
	float: parseFloat,
	integer: parseInt,
	null: parseNull
};
