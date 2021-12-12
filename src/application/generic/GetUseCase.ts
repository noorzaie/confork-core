import type { BaseUseCase } from '../BaseUseCase';
import type { BaseRepositoryType, RepositoryType } from '../../../types/DependencyTypes';
import type { ObjectType } from '../../../types/GenericTypes';

class GetUseCase implements BaseUseCase {
	public constructor(private BaseRepository: BaseRepositoryType, private repository: RepositoryType, private entity: number | ObjectType, private relations: string[] = []) {
	}

	public execute(): Promise<any> {
		return this.BaseRepository.findOne!(this.repository, this.entity, this.relations);
	}
}

export default GetUseCase;
