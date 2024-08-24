import { injectable, inject } from 'inversify';
import { DataSource } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import SocialMediaEntity from '@persistence/entities/instructor-aggregate/social-media.entity';
import { socialMediaData } from './data/social-media.data';

@injectable()
class SocialMediaSeeder {
  private dataSource: DataSource;

  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async seedData(): Promise<void> {
    const socialMediaRepository =
      this.dataSource.getRepository(SocialMediaEntity);

    const count = await socialMediaRepository.count();

    if (count > 0) {
      console.log('Data already exists in Social Media table. Skipping seed.');
      return;
    }

    const socialMediaDataToInsert = socialMediaData.map((x) => {
      const socialMediaEntity = new SocialMediaEntity();

      socialMediaEntity.id = x.id;
      socialMediaEntity.description = x.description;
      socialMediaEntity.baseURL = x.baseURL;
      socialMediaEntity.urlmage = x.urlmage;

      return socialMediaEntity;
    });
    await socialMediaRepository.save(socialMediaDataToInsert);
    console.log(
      `Seeded ${socialMediaDataToInsert.length} Social Media successfully.`
    );
  }
}

export default SocialMediaSeeder;
