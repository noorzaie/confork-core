import type parserHandlers from '../utils/parseHandlers';

// export type ParseHandlerTypes = 'boolean' | 'null' | 'float' | 'int';
export type ParseHandlerTypes = keyof typeof parserHandlers;
