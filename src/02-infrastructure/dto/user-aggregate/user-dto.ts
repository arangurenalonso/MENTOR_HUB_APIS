import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import RoleDomain from '@domain/user-aggregate/role/role.domain';
import UserRoleEntity from '@persistence/entities/user-aggregate/user-role.entity';
import UserEntity from '@persistence/entities/user-aggregate/user.entity';
import userRoleEntity from '@persistence/entities/user-aggregate/user-role.entity';
import TimeZoneDTO from './time-zone.dto';
import ProviderDTO from './provider.dto';

class UserDTO {
  private static convertUserRoles(
    userRoles: UserRoleEntity[]
  ): Result<RoleDomain[], ErrorResult> {
    const roleDomains: RoleDomain[] = [];
    for (const userRole of userRoles) {
      const roleDomainResult = RoleDomain.create({
        id: userRole.role.id,
        description: userRole.role.description,
        idRelation: userRole.id,
      });
      if (roleDomainResult.isErr()) {
        return err(roleDomainResult.error);
      }
      roleDomains.push(roleDomainResult.value);
    }
    return ok(roleDomains);
  }

  public static toDomain(entity: UserEntity): Result<UserDomain, ErrorResult> {
    const rolesResult = this.convertUserRoles(entity.userRoles);
    if (rolesResult.isErr()) {
      return err(rolesResult.error);
    }
    const timeZoneResult = TimeZoneDTO.toDomain(entity.timeZone);
    if (timeZoneResult.isErr()) {
      return err(timeZoneResult.error);
    }
    const providerResult = ProviderDTO.toDomainArray(entity.authProviders);
    if (providerResult.isErr()) {
      return err(providerResult.error);
    }
    const providers = providerResult.value;

    const timeZone = timeZoneResult.value;
    const domainResult = UserDomain.create({
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      roles: rolesResult.value,
      timeZone,
      providers,
    });
    if (domainResult.isErr()) {
      return err(domainResult.error);
    }
    return ok(domainResult.value);
  }

  public static toEntity(domain: UserDomain): UserEntity {
    const entity = new UserEntity();
    if (domain.properties.id) {
      entity.id = domain.properties.id;
    }
    entity.email = domain.properties.email;
    entity.idTimeZone = domain.properties.timeZone.id;
    entity.passwordHash = domain.properties.passwordHash || undefined;
    return entity;
  }
  public static userDomainToUserRoleToEntity(
    domain: UserDomain
  ): userRoleEntity[] {
    const userRoles = domain.properties.roles.map((x) => {
      const userRoleEntity = new UserRoleEntity();

      userRoleEntity.id = x.idRelation!; //TODO
      userRoleEntity.idRol = x.id;
      userRoleEntity.idUser = domain.properties.id;
      return userRoleEntity;
    });
    return userRoles;
  }
}
export default UserDTO;
