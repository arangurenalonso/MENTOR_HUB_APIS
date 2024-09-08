import { inject, injectable } from 'inversify';
import {
  Brackets,
  DataSource,
  EntityManager,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import BaseRepository from './commun/BaseRepository';
import UserDTO from '../../dto/user-aggregate/user-dto';
import UserEntity from '@persistence/entities/user-aggregate/user.entity';
import TimeZoneDomain from '@domain/user-aggregate/timezone/time-zone.domain';
import { validate as uuidValidate } from 'uuid';
import TimeZoneDTO from '@infrastructure/dto/user-aggregate/time-zone.dto';
import TimeZoneEntity from '@persistence/entities/user-aggregate/time-zone.entity';
import ProviderDTO from '@infrastructure/dto/user-aggregate/provider.dto';
import UserRoleDTO from '@infrastructure/dto/user-aggregate/user-role.dto';
import AuthProviderEntity from '@persistence/entities/user-aggregate/user-auth-provider.entity';
import UserRoleEntity from '@persistence/entities/user-aggregate/user-role.entity';

@injectable()
class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  private _repository: Repository<UserEntity>;
  private _userRoleRepository: Repository<UserRoleEntity>;
  private _timeZoneRepository: Repository<TimeZoneEntity>;
  private _authProviderRepository: Repository<AuthProviderEntity>;
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
    this._userRoleRepository =
      this._dataSourceOrEntityManager.getRepository(UserRoleEntity);
    this._timeZoneRepository =
      this._dataSourceOrEntityManager.getRepository(TimeZoneEntity);
    this._authProviderRepository =
      this._dataSourceOrEntityManager.getRepository(AuthProviderEntity);
  }

  protected get repository(): Repository<UserEntity> {
    return this._repository;
  }
  async getIdUserByUidProvider(
    uid: string
  ): Promise<Result<UserDomain | null, ErrorResult>> {
    let query = this._authProviderRepository.createQueryBuilder('provider');

    query = query.where('provider.uidProvider = :uid', { uid });
    const authProviderEntity = await query.getOne();

    if (!authProviderEntity) {
      return ok(null);
    }
    const userEntity = await this.getUserById(authProviderEntity.idUser);
    return userEntity;
  }
  async getTimeZoneById(
    id: string
  ): Promise<Result<TimeZoneDomain | null, ErrorResult>> {
    let query = this._timeZoneRepository.createQueryBuilder('timeZone');

    if (uuidValidate(id)) {
      query = query.where('timeZone.id = :id', { id });
    } else {
      // Si no es un UUID, buscar por el campo 'timeZoneStringId'
      query = query.where('timeZone.timeZoneStringId = :id', { id });
    }
    const timeZoneEntity = await query.getOne();

    if (!timeZoneEntity) {
      return ok(null);
    }

    const timeZoneResult = TimeZoneDTO.toDomain(timeZoneEntity);
    if (timeZoneResult.isErr()) {
      return err(timeZoneResult.error);
    }
    return ok(timeZoneResult.value);
  }

  userQueryBuilderWithRelations = (
    where:
      | Brackets
      | string
      | ((qb: this) => string)
      | ObjectLiteral
      | ObjectLiteral[],
    parameters?: ObjectLiteral
  ): SelectQueryBuilder<UserEntity> => {
    const userEntity = this._repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.timeZone', 'timeZone')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .leftJoinAndSelect('user.authProviders', 'authProviders')
      .where(where, parameters)
      .andWhere('user.active = :userActive', { userActive: true })
      .andWhere(
        new Brackets((qb) => {
          qb.where('userRole.active is null').orWhere(
            'userRole.active = :userRoleActive',
            {
              userRoleActive: true,
            }
          );
        })
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('authProviders.active is null').orWhere(
            'authProviders.active = :authProvidersActive',
            {
              authProvidersActive: true,
            }
          );
        })
      );
    return userEntity;
  };

  async getUserById(
    id: string
  ): Promise<Result<UserDomain | null, ErrorResult>> {
    const userEntity = await this.userQueryBuilderWithRelations(
      'user.id = :userId',
      {
        userId: id,
      }
    ).getOne();

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

  async getUserByEmail(
    email?: string
  ): Promise<Result<UserDomain | null, ErrorResult>> {
    if (!email) {
      return ok(null);
    }
    const userEntity = await this.userQueryBuilderWithRelations(
      'user.email = :email',
      { email }
    ).getOne();

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

    const userRoleEntity = UserRoleDTO.toEntityArray(
      user.properties.id,
      user.properties.roles
    );

    const authProviderEntity = ProviderDTO.toEntityArray(
      user.properties.id,
      user.properties.providers
    );
    this.create(userEntity);
    await Promise.all([
      this._userRoleRepository.save(userRoleEntity),
      this._authProviderRepository.save(authProviderEntity),
    ]);
  }

  async modify(user: UserDomain): Promise<void> {
    const userEntity = UserDTO.toEntity(user);
    const userRoleEntity = UserRoleDTO.toEntityArray(
      user.properties.id,
      user.properties.roles
    );
    const authProviderEntity = ProviderDTO.toEntityArray(
      user.properties.id,
      user.properties.providers
    );
    await Promise.all([
      this.updateEntities<UserRoleEntity>(
        userRoleEntity,
        this._userRoleRepository
      ),
      this.updateEntities<AuthProviderEntity>(
        authProviderEntity,
        this._authProviderRepository
      ),
      this.repository.save(userEntity),
    ]);
  }
}
export default UserRepository;
