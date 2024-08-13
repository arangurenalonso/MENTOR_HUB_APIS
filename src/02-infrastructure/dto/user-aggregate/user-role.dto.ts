import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import UserRoleEntity from '@persistence/entities/user-aggregate/user-role.entity';
import RoleDomain, {
  RoleDomainProperties,
} from '@domain/user-aggregate/role/role.domain';

class UserRoleDTO {
  public static ToDomain(
    entity: UserRoleEntity
  ): Result<RoleDomain, ErrorResult> {
    const domainResult = RoleDomain.create({
      id: entity.role.id,
      description: entity.role.description,
      idRelation: entity.id,
    });
    if (domainResult.isErr()) {
      return err(domainResult.error);
    }
    return ok(domainResult.value);
  }

  public static ToDomainArray(
    entities?: UserRoleEntity[] | null
  ): Result<RoleDomain[], ErrorResult> {
    if (!entities) {
      return ok([]);
    }
    const domainArray: RoleDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.ToDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      domainArray.push(entityResult.value);
    }
    return ok(domainArray);
  }
  public static toEntity(
    idUser: string,
    domain: RoleDomainProperties
  ): UserRoleEntity {
    const entity = new UserRoleEntity();
    if (domain.idRelation) {
      entity.id = domain.idRelation;
    }
    entity.idUser = idUser;
    entity.idRol = domain.id;
    return entity;
  }

  public static toEntityArray(
    idUser: string,
    domainArray: RoleDomainProperties[] = []
  ): UserRoleEntity[] {
    return domainArray.map((domain) => this.toEntity(idUser, domain));
  }
}
export default UserRoleDTO;
