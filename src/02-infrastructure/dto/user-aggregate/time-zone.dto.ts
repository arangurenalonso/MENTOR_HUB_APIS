import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import TimeZoneDomain from '@domain/user-aggregate/timezone/time-zone.domain';
import TimeZoneEntity from '@persistence/entities/user-aggregate/time-zone.entity';

class TimeZoneDTO {
  public static toDomain(
    entity: TimeZoneEntity
  ): Result<TimeZoneDomain, ErrorResult> {
    const timeZoneResult = TimeZoneDomain.create({
      id: entity.id,
      offsetMinutes: entity.offsetMinutes,
      offsetHours: entity.offsetHours,
      timeZoneStringId: entity.timeZoneStringId,
      isDaylightSavingTime: entity.isDaylightSavingTime,
    });
    if (timeZoneResult.isErr()) {
      return err(timeZoneResult.error);
    }
    return ok(timeZoneResult.value);
  }

  public static toEntity(domain: TimeZoneDomain): TimeZoneEntity {
    const entity = new TimeZoneEntity();
    if (domain.properties.id) {
      entity.id = domain.properties.id;
    }
    entity.offsetMinutes = domain.properties.offsetMinutes;
    entity.offsetHours = domain.properties.offsetHours;
    entity.timeZoneStringId = domain.properties.timeZoneStringId;
    entity.isDaylightSavingTime = domain.properties.isDaylightSavingTime;
    entity.description = domain.properties.description;
    return entity;
  }
}
export default TimeZoneDTO;
