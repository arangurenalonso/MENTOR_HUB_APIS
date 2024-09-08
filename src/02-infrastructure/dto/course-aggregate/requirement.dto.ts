import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import RequirementEntity from '@persistence/entities/courses-aggregate/requirement.entity';
import RequirementDomain, {
  RequirementDomainProperties,
} from '@domain/courses-aggregate/requirement/requirement.domain';

class RequirementDTO {
  public static toDomain(
    entity: RequirementEntity
  ): Result<RequirementDomain, ErrorResult> {
    const result = RequirementDomain.create({
      id: entity.id,
      description: entity.description,
    });
    if (result.isErr()) {
      return err(result.error);
    }
    return ok(result.value);
  }
  public static toDomainArray(
    entities?: RequirementEntity[] | null
  ): Result<RequirementDomain[], ErrorResult> {
    if (entities === undefined || entities === null) {
      return ok([]);
    }

    const domainArray: RequirementDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.toDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      domainArray.push(entityResult.value);
    }
    return ok(domainArray);
  }

  public static toEntity(
    idCourse: string,
    domain: RequirementDomainProperties
  ): RequirementEntity {
    const entity = new RequirementEntity();
    entity.id = domain.id;
    entity.description = domain.description;
    entity.idCourse = idCourse;
    return entity;
  }

  public static toEntityArray(
    idUser: string,
    domainArray: RequirementDomainProperties[] = []
  ): RequirementEntity[] {
    return domainArray.map((domain) => this.toEntity(idUser, domain));
  }
}
export default RequirementDTO;
