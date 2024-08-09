import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import DayOfWeekDomain from '@domain/intructor-aggregate/availability/day-of-week.domain';
import DayOfWeekEntity from '@persistence/entities/instructor-aggregate/day-of-week.entity';

class DayOfWeekDTO {
  public static toDomain(
    entity: DayOfWeekEntity
  ): Result<DayOfWeekDomain, ErrorResult> {
    const result = DayOfWeekDomain.create({
      id: entity.id,
      dayIndex: entity.index,
      dayName: entity.name,
    });
    if (result.isErr()) {
      return err(result.error);
    }
    return ok(result.value);
  }
  public static toDomainArray(
    entities: DayOfWeekEntity[]
  ): Result<DayOfWeekDomain[], ErrorResult> {
    const domainArray: DayOfWeekDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.toDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      domainArray.push(entityResult.value);
    }
    return ok(domainArray);
  }

  public static toEntity(domain: DayOfWeekDomain): DayOfWeekEntity {
    const entity = new DayOfWeekEntity();
    entity.id = domain.properties.id;
    entity.index = domain.properties.dayIndex;
    entity.name = domain.properties.dayName;
    return entity;
  }
}
export default DayOfWeekDTO;
