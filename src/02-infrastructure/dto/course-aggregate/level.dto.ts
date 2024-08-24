import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import LevelDomain from '@domain/courses-aggregate/level/level.domain';
import LevelEntity from '@persistence/entities/courses-aggregate/level.entity';

class LevelDTO {
  public static toDomain(
    entity: LevelEntity
  ): Result<LevelDomain, ErrorResult> {
    const domainResult = LevelDomain.create({
      id: entity.id,
      description: entity.description,
    });
    if (domainResult.isErr()) {
      return err(domainResult.error);
    }
    return ok(domainResult.value);
  }

  public static toEntity(domain: LevelDomain): LevelEntity {
    const entity = new LevelEntity();
    if (domain.properties.id) {
      entity.id = domain.properties.id;
    }
    entity.description = domain.properties.description;
    return entity;
  }
  public static toDomainList(
    entities: LevelEntity[]
  ): Result<LevelDomain[], ErrorResult> {
    const domainArray: LevelDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.toDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      domainArray.push(entityResult.value);
    }
    return ok(domainArray);
  }
}
export default LevelDTO;
