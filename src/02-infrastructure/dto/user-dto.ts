import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import RoleDomain from '@domain/user-aggregate/role/role.domain';
import UserRoleEntity from '@persistence/entities/user-aggregate/user-role.entity';
import UserEntity from '@persistence/entities/user-aggregate/user.entity';
import PersonDTO from './person.dto';

class UserDTO {
  private static convertUserRoles(
    userRoles: UserRoleEntity[]
  ): Result<RoleDomain[], ErrorResult> {
    const roleDomains: RoleDomain[] = [];
    for (const userRole of userRoles) {
      const roleDomainResult = RoleDomain.create({
        id: userRole.role.id,
        description: userRole.role.description,
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
    const domainResult = UserDomain.create({
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      roles: rolesResult.value,
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
    entity.passwordHash = domain.properties.passwordHash;
    entity.userRoles = domain.properties.roles.map((x) => {
      const userRoleEntity = new UserRoleEntity();
      userRoleEntity.idRol = x.id;
      userRoleEntity.idUser = domain.properties.id;
      return userRoleEntity;
    });
    return entity;
  }
}
export default UserDTO;
