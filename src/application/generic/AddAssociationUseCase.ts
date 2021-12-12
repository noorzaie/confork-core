import type { BaseUseCase } from '../BaseUseCase';
import type { BaseRepositoryType, RepositoryType } from '../../../types/DependencyTypes';
import type { ObjectType } from '../../../types/GenericTypes';

class AddAssociationUseCase implements BaseUseCase {
	public constructor(
		private BaseRepository: BaseRepositoryType,
		private repository: RepositoryType,
		private entity: number | ObjectType,
		private relationKey: string,
		private relationData: ObjectType | (ObjectType | number)[] | number,
		private relationRepository: RepositoryType,
		private keepOld: boolean = true
	) {
	}

	public execute(): Promise<any> {
		return this.BaseRepository.addAssociation!(this.repository, this.entity, this.relationKey, this.relationData, this.relationRepository, this.keepOld);
	}
}

export default AddAssociationUseCase;
