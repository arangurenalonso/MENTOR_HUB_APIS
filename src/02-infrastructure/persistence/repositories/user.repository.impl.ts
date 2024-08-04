import { inject, injectable, optional } from 'inversify';
import { DataSource, EntityManager, Repository } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import BaseRepository from './commun/BaseRepository';
import UserDTO from '../../dto/user-dto';
import UserEntity from '@persistence/entities/user-aggregate/user.entity';
import UserRoleEntity from '@persistence/entities/user-aggregate/user-role.entity';
import { RoleEnum } from '@domain/user-aggregate/role/enum/role.enum';

@injectable()
class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  private _repository: Repository<UserEntity>;
  private _userRolerepository: Repository<UserRoleEntity>;

  constructor(
    @inject(TYPES.DataSource)
    private readonly _dataSourceOrEntityManager: DataSource | EntityManager
  ) {
    super();
    if (this._dataSourceOrEntityManager instanceof DataSource) {
      console.log('instance of DataSource');
    } else if (this._dataSourceOrEntityManager instanceof EntityManager) {
      console.log('instance of EntityManager');
    } else {
      throw new Error('Invalid constructor argument');
    }
    this._repository =
      this._dataSourceOrEntityManager.getRepository(UserEntity);
    this._userRolerepository =
      this._dataSourceOrEntityManager.getRepository(UserRoleEntity);
  }

  async getUserById(
    id: string
  ): Promise<Result<UserDomain | null, ErrorResult>> {
    const userEntity = await this._repository.findOne({
      where: { id: id },
      relations: [
        'userRoles',
        'userRoles.role',
        // 'person',
        // 'person.naturalPerson',
        // 'person.legalPerson',
        // 'person.emails',
      ],
    });
    if (!userEntity) {
      return ok(null);
    }
    const userDomainResult = UserDTO.toDomain(userEntity);
    if (userDomainResult.isErr()) {
      return err(userDomainResult.error);
    }
    const user = userDomainResult.value;
    return ok(user);
  }

  protected get repository(): Repository<UserEntity> {
    return this._repository;
  }

  async getUserByEmail(
    email?: string
  ): Promise<Result<UserDomain | null, ErrorResult>> {
    if (!email) {
      return ok(null);
    }
    const userEntity = await this._repository.findOne({
      where: {
        email: email,
      },
      relations: [
        'userRoles',
        'userRoles.role',
        // 'person',
        // 'person.naturalPerson',
        // 'person.legalPerson',
        // 'person.emails',
      ],
    });

    if (!userEntity) {
      return ok(null);
    }
    const userDomainResult = UserDTO.toDomain(userEntity);
    if (userDomainResult.isErr()) {
      return err(userDomainResult.error);
    }
    const user = userDomainResult.value;
    return ok(user);
  }

  async register(user: UserDomain): Promise<void> {
    const userEntity = UserDTO.toEntity(user);
    await this.create(userEntity);

    await this._userRolerepository.save(userEntity.userRoles);
  }
}
export default UserRepository;
