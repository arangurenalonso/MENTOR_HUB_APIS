import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import TimeOptionDomain from '@domain/intructor-aggregate/availability/time-option.domain';
import TimeOptionEntity from '@persistence/entities/instructor-aggregate/time-options.entity';

class TimeOptionDTO {
  public static toDomain(
    entity: TimeOptionEntity
  ): Result<TimeOptionDomain, ErrorResult> {
    const result = TimeOptionDomain.create({
      id: entity.id,
      index: entity.index,
      value: entity.value,
    });
    if (result.isErr()) {
      return err(result.error);
    }
    return ok(result.value);
  }

  public static toDomainArray(
    entities: TimeOptionEntity[]
  ): Result<TimeOptionDomain[], ErrorResult> {
    const domainArray: TimeOptionDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.toDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      domainArray.push(entityResult.value);
    }
    return ok(domainArray);
  }

  public static toEntity(domain: TimeOptionDomain): TimeOptionEntity {
    const entity = new TimeOptionEntity();
    entity.id = domain.properties.id;
    entity.index = domain.properties.index;
    entity.value = domain.properties.value;

    return entity;
  }
}
export default TimeOptionDTO;
