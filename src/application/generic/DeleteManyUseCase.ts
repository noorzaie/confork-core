import type { ParseReturnType } from 'aqs';
import type { BaseUseCase } from '../BaseUseCase';
import type { BaseRepositoryType, RepositoryType } from '../../../types/DependencyTypes';

class DeleteManyUseCase implements BaseUseCase {
	public constructor(private BaseRepository: BaseRepositoryType, private repository: RepositoryType, private criteria: ParseReturnType, private soft: boolean = false) {
	}

	public execute(): Promise<any> {
		return this.BaseRepository.deleteMany!(this.repository, this.criteria, this.soft);
	}
}

export default DeleteManyUseCase;
