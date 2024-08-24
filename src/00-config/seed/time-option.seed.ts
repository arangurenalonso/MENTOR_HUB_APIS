import { injectable, inject } from 'inversify';
import { DataSource } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import TimeOptionEntity from '@persistence/entities/instructor-aggregate/time-options.entity';
import { timeOptionData } from './data/time-option.data';

@injectable()
class TimeOptionSeeder {
  private dataSource: DataSource;

  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async seedData(): Promise<void> {
    const timeOptionRepository =
      this.dataSource.getRepository(TimeOptionEntity);
    const count = await timeOptionRepository.count();

    if (count > 0) {
      console.log('Data already exists in timeOption table. Skipping seed.');
      return;
    }

    const timeOptionDataToInsert = timeOptionData.map((x) => {
      const timeOptionEntity = new TimeOptionEntity();

      timeOptionEntity.id = x.id;
      timeOptionEntity.value = x.time;
      timeOptionEntity.index = x.order;

      return timeOptionEntity;
    });
    // Inserción masiva
    await timeOptionRepository.save(timeOptionDataToInsert);
    console.log(`Seeded ${timeOptionData.length} timeOption successfully.`);
  }
}

export default TimeOptionSeeder;
