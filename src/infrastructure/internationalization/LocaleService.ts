import { I18n } from 'i18n';
import type { ObjectType } from '../../../types/GenericTypes';
import config from '../../../config';
import { importI18nConfig } from '../../../utils/importUtils/importProjectFileUtils';

const i18nProvider = new I18n();

class LocaleService {
	private readonly locale;

	public constructor() {
		this.locale = config.locale;
	}

	public translate = (string: string, args: ObjectType = {}, locale?: string): string => {
		const isAjv = args.isAjv === true;

		for (const [ key, value ] of Object.entries(args)) {
			args[key] = !isAjv || key === 'resource' ? this.translateKey(value) : value;	// skip translating ajv error params
		}

		return i18nProvider.__({ phrase: string, locale: locale || this.locale }, args);
	}

	private translateKey = (string: string): string => {
		return i18nProvider.__({ phrase: string, locale: this.locale });
	}
}

export default async () => {
	i18nProvider.configure(await importI18nConfig());
	return LocaleService;
};

export type LocaleServiceType = LocaleService;
