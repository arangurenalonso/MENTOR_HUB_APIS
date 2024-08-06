import {
  Entity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';
import NaturalPersonEntity from '../person-aggreagte/natural_person.entity';
import BaseEntity from '../abstrations/base.entity';
import InstructorSocialMediaEntity from './instructor-social-media.entity';

@Entity({ name: 'instructor' })
class InstructorEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: true })
  websideURL?: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  headline?: string;

  @Column({ type: 'varchar', length: 600, default: '' })
  introduction!: string;

  @Column({ type: 'varchar', length: 600, default: '' })
  teachingExperience!: string;

  @Column({ type: 'varchar', length: 600, default: '' })
  motivation?: string;

  @OneToOne(() => NaturalPersonEntity)
  @JoinColumn({ name: 'id' })
  naturalPerson!: NaturalPersonEntity;

  @OneToMany(
    () => InstructorSocialMediaEntity,
    (instructorSocialMedia) => instructorSocialMedia.instructor
  )
  instructorSocialMedia!: InstructorSocialMediaEntity[];
}

export default InstructorEntity;
