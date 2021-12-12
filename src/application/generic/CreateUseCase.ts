import type { BaseUseCase } from '../BaseUseCase';
import type { BaseRepositoryType, RepositoryType } from '../../../types/DependencyTypes';
import type { ObjectType } from '../../../types/GenericTypes';

class CreateUseCase implements BaseUseCase {
	public constructor(private BaseRepository: BaseRepositoryType, private repository: RepositoryType, private data: ObjectType) {
	}

	public execute(): Promise<any> {
		return this.BaseRepository.create!(this.repository, this.data);
	}
}

export default CreateUseCase;
