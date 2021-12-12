import type { BaseUseCase } from '../BaseUseCase';
import type { BaseRepositoryType, RepositoryType } from '../../../types/DependencyTypes';
import type { ObjectType } from '../../../types/GenericTypes';

class DeleteUseCase implements BaseUseCase {
	public constructor(private BaseRepository: BaseRepositoryType, private repository: RepositoryType, private entity: number | ObjectType, private soft: boolean = false) {
	}

	public execute(): Promise<any> {
		return this.BaseRepository.delete!(this.repository, this.entity, this.soft);
	}
}

export default DeleteUseCase;
