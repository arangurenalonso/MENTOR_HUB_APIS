import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import LearningObjectiveDomain, {
  LearningObjectiveDomainProperties,
} from '@domain/courses-aggregate/learning-objective/learning-objective.domain';
import LearningObjectiveEntity from '@persistence/entities/courses-aggregate/learning-objective.entity';

class LearningObjectiveDTO {
  public static toDomain(
    entity: LearningObjectiveEntity
  ): Result<LearningObjectiveDomain, ErrorResult> {
    const result = LearningObjectiveDomain.create({
      id: entity.id,
      description: entity.description,
    });
    if (result.isErr()) {
      return err(result.error);
    }
    return ok(result.value);
  }
  public static toDomainArray(
    entities?: LearningObjectiveEntity[] | null
  ): Result<LearningObjectiveDomain[], ErrorResult> {
    if (entities === undefined || entities === null) {
      return ok([]);
    }

    const domainArray: LearningObjectiveDomain[] = [];
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
    domain: LearningObjectiveDomainProperties
  ): LearningObjectiveEntity {
    const entity = new LearningObjectiveEntity();
    entity.id = domain.id;
    entity.description = domain.description;
    entity.idCourse = idCourse;
    return entity;
  }

  public static toEntityArray(
    idCourse: string,
    domainArray: LearningObjectiveDomainProperties[] = []
  ): LearningObjectiveEntity[] {
    return domainArray.map((domain) => this.toEntity(idCourse, domain));
  }
}
export default LearningObjectiveDTO;
