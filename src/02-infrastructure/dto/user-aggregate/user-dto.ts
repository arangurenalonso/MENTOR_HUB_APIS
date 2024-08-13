import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import UserEntity from '@persistence/entities/user-aggregate/user.entity';
import TimeZoneDTO from './time-zone.dto';
import ProviderDTO from './provider.dto';
import UserRoleDTO from './user-role.dto';

class UserDTO {
  public static toDomain(entity: UserEntity): Result<UserDomain, ErrorResult> {
    const rolesResult = UserRoleDTO.ToDomainArray(entity.userRoles);
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
}
export default UserDTO;
