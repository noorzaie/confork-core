import type { BaseUseCase } from '../BaseUseCase';
import type { BaseRepositoryType, RepositoryType } from '../../../types/DependencyTypes';
import type { ObjectType } from '../../../types/GenericTypes';

class UpdateUseCase implements BaseUseCase {
	public constructor(private BaseRepository: BaseRepositoryType, private repository: RepositoryType, private data: ObjectType, private entity: number | ObjectType) {
	}

	public execute(): Promise<any> {
		return this.BaseRepository.update!(this.repository, this.entity, this.data);
	}
}

export default UpdateUseCase;
