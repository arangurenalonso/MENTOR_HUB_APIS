import { injectable, inject } from 'inversify';
import { DataSource } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import LevelEntity from '@persistence/entities/courses-aggregate/level.entity';
import { levelData } from './data/level.data';

@injectable()
class LevelSeeder {
  private dataSource: DataSource;

  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async seedData(): Promise<void> {
    const socialMediaRepository = this.dataSource.getRepository(LevelEntity);

    const count = await socialMediaRepository.count();

    if (count > 0) {
      console.log('Data already exists in level table. Skipping seed.');
      return;
    }

    const levelDataToInsert = levelData.map((x) => {
      const levelEntity = new LevelEntity();

      levelEntity.id = x.id;
      levelEntity.description = x.description;
      return levelEntity;
    });
    await socialMediaRepository.save(levelDataToInsert);
    console.log(`Seeded ${levelDataToInsert.length} Level successfully.`);
  }
}

export default LevelSeeder;
