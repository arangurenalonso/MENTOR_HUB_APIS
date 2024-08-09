import { injectable, inject } from 'inversify';
import { DataSource } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import SocialMediaEntity from '@persistence/entities/instructor-aggregate/social-media.entity';
import SocialMediaEnum from '@domain/intructor-aggregate/social-media/enum/social-media.enum';

@injectable()
class SocialMediaSeeder {
  private dataSource: DataSource;

  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async seedData(): Promise<void> {
    const socialMediaRepository =
      this.dataSource.getRepository(SocialMediaEntity);

    for (const key of Object.keys(
      SocialMediaEnum
    ) as (keyof typeof SocialMediaEnum)[]) {
      const socialMedia = SocialMediaEnum[key];
      const socialMediaExists = await socialMediaRepository.findOneBy({
        description: socialMedia.description,
      });
      if (!socialMediaExists) {
        const newSocialMedia = socialMediaRepository.create(socialMedia);
        await socialMediaRepository.save(newSocialMedia);
        console.log(
          `Social Media ${socialMedia.description} seeded successfully.`
        );
      } else {
        console.log(`Social Media ${socialMedia.description} already exists.`);
      }
    }
  }
}

export default SocialMediaSeeder;
