import { injectable, inject } from 'inversify';
import { DataSource } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import DayOfWeekEntity from '@persistence/entities/instructor-aggregate/day-of-week.entity';
import { dayOfWeekData } from './data/day-of-week.data';

@injectable()
class DayOfWeekSeeder {
  private dataSource: DataSource;

  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async seedData(): Promise<void> {
    const dayOfWeekRepository = this.dataSource.getRepository(DayOfWeekEntity);

    const dateOfWeekDataToInsert = dayOfWeekData.map((x) => {
      const dayOfWeekEntity = new DayOfWeekEntity();

      dayOfWeekEntity.id = x.id;
      dayOfWeekEntity.name = x.dayName;
      dayOfWeekEntity.index = x.dayIndex;

      return dayOfWeekEntity;
    });
    // Inserción masiva
    await dayOfWeekRepository.save(dateOfWeekDataToInsert);
    console.log(`Seeded ${dayOfWeekData.length} dayOfWeek successfully.`);
  }
}

export default DayOfWeekSeeder;
