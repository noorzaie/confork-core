import type { BaseUseCase } from '../BaseUseCase';
import type { BaseRepositoryType, RepositoryType } from '../../../types/DependencyTypes';
import type { ObjectType } from '../../../types/GenericTypes';

class RemoveAssociationUseCase implements BaseUseCase {
	public constructor(
		private BaseRepository: BaseRepositoryType,
		private repository: RepositoryType,
		private entity: number | ObjectType,
		private relationKey: string,
		private relationId: number | number[]
	) {
	}

	public execute(): Promise<any> {
		return this.BaseRepository.removeAssociation!(this.repository, this.entity, this.relationKey, this.relationId);
	}
}

export default RemoveAssociationUseCase;
