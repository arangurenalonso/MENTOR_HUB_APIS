import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import SocialMediaEntity from './social-media.entity';
import InstructorEntity from './instructor.entity';

@Entity({ name: 'instructor_social_media' })
class InstructorSocialMediaEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  idInstructor!: string;

  @Column({ type: 'uuid', nullable: false })
  idSocialMedia!: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  urlProfile!: string;

  @ManyToOne(
    () => InstructorEntity,
    (instructor) => instructor.instructorSocialMedia
  )
  @JoinColumn({
    name: 'idInstructor',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_InstructorSocialMedia_Instructor',
  })
  instructor!: InstructorEntity;

  @ManyToOne(
    () => SocialMediaEntity,
    (socialMedia) => socialMedia.instructorSocialMedia
  )
  @JoinColumn({
    name: 'idSocialMedia',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_InstructorSocialMedia_SocialMedia',
  })
  socialMedia!: SocialMediaEntity;
}
export default InstructorSocialMediaEntity;
