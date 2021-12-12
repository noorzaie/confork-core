import type { ParseReturnType } from 'aqs';
import type { ConfigType as AQSTypeOrmConfigType } from 'aqs-typeorm';
import type { BaseUseCase } from '../BaseUseCase';
import type { BaseRepositoryType, RepositoryType } from '../../../types/DependencyTypes';

class ListUseCase implements BaseUseCase {
	public constructor(private BaseRepository: BaseRepositoryType, private repository: RepositoryType, private criteria: ParseReturnType | {} = {}, private aqsTypeOrmConfig: AQSTypeOrmConfigType | undefined = undefined) {
	}

	public async execute(): Promise<any> {
		return this.BaseRepository.findAll!(this.repository, this.criteria, this.aqsTypeOrmConfig);
	}
}

export default ListUseCase;
