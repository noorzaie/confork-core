import type { ErrorObject } from 'ajv';
import type { Request as ExpressRequest } from 'express';
import type { Request as KoaRequest } from 'koa';
import type { SwaggerOptions, SwaggerUiOptions } from 'swagger-ui-express';
import type { KoaSwaggerUiOptions } from 'koa2-swagger-ui';
import type InternalServerError from '../utils/error/InternalServerError';
import type ValidationError from '../utils/error/ValidationError';
import type NotFoundError from '../utils/error/NotFoundError';

export type EnvType = 'development' | 'production' | 'test';

export type ObjectType = { [key: string]: any };

export interface MethodHandlerType<H, A> {
	handler: H;
	args: A;
}

export interface ValidationErrorsType {
	[key: string]: string[];
}

export interface AjvValidateOptionsType {
	required?: string[];
	additionalProperties?: boolean;
}

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ResponseErrorsType = ValidationErrorsType | null | ErrorObject[];

export type ErrorClassesType = InternalServerError | ValidationError | NotFoundError;

export type RequestType = ExpressRequest | KoaRequest;

export type InterfaceType = 'koa' | 'express';

export interface ExpressSwaggerOptions {
	swaggerUiOptions?: SwaggerUiOptions,
	swaggerOptions?: SwaggerOptions
}

export type KoaSwaggerOptions = Partial<KoaSwaggerUiOptions>;

type Only<T, U> = {
	[P in keyof T]: T[P];
} & {
	[P in keyof Omit<U, keyof T>]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;
