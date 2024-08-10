import { inject, injectable, optional } from 'inversify';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import BaseRepository from './commun/BaseRepository';
import UserDTO from '../../dto/user-aggregate/user-dto';
import UserEntity from '@persistence/entities/user-aggregate/user.entity';
import UserRoleEntity from '@persistence/entities/user-aggregate/user-role.entity';
import TimeZoneDomain from '@domain/user-aggregate/timezone/time-zone.domain';
import { validate as uuidValidate } from 'uuid';
import TimeZoneDTO from '@infrastructure/dto/user-aggregate/time-zone.dto';
import TimeZoneEntity from '@persistence/entities/user-aggregate/time-zone.entity';

@injectable()
class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  private _repository: Repository<UserEntity>;
  private _userRoleRepository: Repository<UserRoleEntity>;
  private _timeZoneRepository: Repository<TimeZoneEntity>;
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
  }

  protected get repository(): Repository<UserEntity> {
    return this._repository;
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

  async getUserById(
    id: string
  ): Promise<Result<UserDomain | null, ErrorResult>> {
    const userEntity = await this._repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.timeZone', 'timeZone')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('user.id = :userId', { userId: id })
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
      .getOne();
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

    const userEntity = await this._repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.timeZone', 'timeZone')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('user.email = :email', { email })
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
      .getOne();
    // SELECT * FROM instructor
    // LEFT JOIN instructor_social_media ON ...
    // LEFT JOIN social_media ON ...
    // WHERE instructor.id = :id
    //   AND instructor.active = :instructorActive
    //   AND (socialMedia.active IS NULL OR socialMedia.active = :socialMediaActive)

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

    const userRoleEntity = UserDTO.userDomainToUserRoleToEntity(user);
    await this._userRoleRepository.save(userRoleEntity);
  }

  async modify(user: UserDomain): Promise<void> {
    const userEntity = UserDTO.toEntity(user);
    await this.repository.save(userEntity);

    const userRoleEntity = UserDTO.userDomainToUserRoleToEntity(user);
    await this._userRoleRepository.save(userRoleEntity);
  }
}
export default UserRepository;
