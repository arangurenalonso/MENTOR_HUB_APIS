import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import RoleDomain from '@domain/user-aggregate/role/role.domain';
import RoleEntity from '@persistence/entities/user-aggregate/role.entity';

class RoleDTO {
  public static toDomain(entity: RoleEntity): Result<RoleDomain, ErrorResult> {
    const domainResult = RoleDomain.create({
      id: entity.id,
      description: entity.description,
    });
    if (domainResult.isErr()) {
      return err(domainResult.error);
    }
    return ok(domainResult.value);
  }

  public static toEntity(domain: RoleDomain): RoleEntity {
    const entity = new RoleEntity();
    if (domain.properties.id) {
      entity.id = domain.properties.id;
    }
    entity.description = domain.properties.description;
    return entity;
  }
}
export default RoleDTO;
