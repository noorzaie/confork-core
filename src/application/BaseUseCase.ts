export interface BaseUseCase {
	execute (): Promise<any>;
}
