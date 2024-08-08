import { injectable, inject } from 'inversify';
import { DataSource } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import TimeZoneEntity from '@persistence/entities/user-aggregate/time-zone.entity';
import { dataTimeZoneData } from './data/time-zone.data';

@injectable()
class TimeZoneSeeder {
  private dataSource: DataSource;

  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async seedTimeZones(): Promise<void> {
    const timeZoneRepository = this.dataSource.getRepository(TimeZoneEntity);

    // Verificar si existen registros en la tabla
    const count = await timeZoneRepository.count();

    // if (count > 0) {
    //   console.log('TimeZone data already exists, skipping seeding.');
    //   return;
    // }
    const dataTimeZoneDataToInsert = dataTimeZoneData.map((x) => {
      const timeZoneEntity = new TimeZoneEntity();
      timeZoneEntity.id = x.id;
      timeZoneEntity.timeZoneStringId = x.timezone_id;
      timeZoneEntity.description = x.description;
      timeZoneEntity.offsetHours = x.offset_hours;
      timeZoneEntity.offsetMinutes = x.offset_minutes;
      timeZoneEntity.isDaylightSavingTime = x.is_dst;
      return timeZoneEntity;
    });
    // Inserción masiva
    await timeZoneRepository.save(dataTimeZoneDataToInsert);
    console.log(`Seeded ${dataTimeZoneData.length} timezones successfully.`);
  }
}

export default TimeZoneSeeder;
