import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import IRoleRepository from '@domain/user-aggregate/role/repositories/IRole.repository';
import RoleDomain from '@domain/user-aggregate/role/role.domain';
import { injectable, inject } from 'inversify';
import { Repository, DataSource, EntityManager } from 'typeorm';
import BaseRepository from './commun/BaseRepository';
import RoleDTO from '../../dto/role-dto';
import RoleEntity from '@persistence/entities/user-aggregate/role.entity';

@injectable()
class RoleRepository
  extends BaseRepository<RoleEntity>
  implements IRoleRepository
{
  private _repository: Repository<RoleEntity>;

  protected get repository(): Repository<RoleEntity> {
    return this._repository;
  }
  constructor(
    @inject(TYPES.DataSource)
    private readonly _dataSourceOrEntityManager: DataSource | EntityManager
  ) {
    super();
    if (this._dataSourceOrEntityManager instanceof DataSource) {
      this._repository =
        this._dataSourceOrEntityManager.getRepository(RoleEntity);
    } else if (this._dataSourceOrEntityManager instanceof EntityManager) {
      this._repository =
        this._dataSourceOrEntityManager.getRepository(RoleEntity);
    } else {
      throw new Error('Invalid constructor argument');
    }
  }
  async getRoleById(
    id: string
  ): Promise<Result<RoleDomain | null, ErrorResult>> {
    const roleEntity = await this._repository.findOneBy({
      id: id,
    });
    if (!roleEntity) {
      return ok(null);
    }
    const userDomainResult = RoleDTO.toDomain(roleEntity);
    if (userDomainResult.isErr()) {
      return err(userDomainResult.error);
    }
    const role = userDomainResult.value;
    return ok(role);
  }
  async getRoleByDescription(
    description: string
  ): Promise<Result<RoleDomain | null, ErrorResult>> {
    if (!description) {
      return ok(null);
    }
    const roleEntity = await this._repository.findOneBy({
      description: description,
    });

    if (!roleEntity) {
      return ok(null);
    }
    const roleDomainResult = RoleDTO.toDomain(roleEntity);
    if (roleDomainResult.isErr()) {
      return err(roleDomainResult.error);
    }
    const role = roleDomainResult.value;
    return ok(role);
  }
}
export default RoleRepository;
