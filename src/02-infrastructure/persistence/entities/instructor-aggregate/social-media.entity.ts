import { Column, Entity, OneToMany } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import InstructorSocialMediaEntity from './instructor-social-media.entity';

@Entity({ name: 'social_media' })
class SocialMediaEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  description!: string;

  @Column({ type: 'varchar', length: 1000, nullable: false, unique: true })
  baseURL!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  urlmage!: string;

  @OneToMany(
    () => InstructorSocialMediaEntity,
    (instructorSocialMedia) => instructorSocialMedia.socialMedia
  )
  instructorSocialMedia!: InstructorSocialMediaEntity[];
}
export default SocialMediaEntity;
