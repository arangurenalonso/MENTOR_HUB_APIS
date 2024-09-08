import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import IntendedLearnerDomain, {
  IntendedLearnerDomainProperties,
} from '@domain/courses-aggregate/intended-learner/intended-learner.domain';
import IntendedLearnerEntity from '@persistence/entities/courses-aggregate/intended-learners.entity';

class IntendedLearnerDTO {
  public static toDomain(
    entity: IntendedLearnerEntity
  ): Result<IntendedLearnerDomain, ErrorResult> {
    const result = IntendedLearnerDomain.create({
      id: entity.id,
      description: entity.description,
    });
    if (result.isErr()) {
      return err(result.error);
    }
    return ok(result.value);
  }

  public static toDomainArray(
    entities?: IntendedLearnerEntity[] | null
  ): Result<IntendedLearnerDomain[], ErrorResult> {
    if (entities === undefined || entities === null) {
      return ok([]);
    }

    const domainArray: IntendedLearnerDomain[] = [];
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
    domain: IntendedLearnerDomainProperties
  ): IntendedLearnerEntity {
    const entity = new IntendedLearnerEntity();
    entity.id = domain.id;
    entity.description = domain.description;
    entity.idCourse = idCourse;
    return entity;
  }

  public static toEntityArray(
    idUser: string,
    domainArray: IntendedLearnerDomainProperties[] = []
  ): IntendedLearnerEntity[] {
    return domainArray.map((domain) => this.toEntity(idUser, domain));
  }
}
export default IntendedLearnerDTO;
