import { Entity, OneToOne, JoinColumn, OneToMany, Column } from 'typeorm';
import NaturalPersonEntity from '../person-aggreagte/natural_person.entity';
import BaseEntity from '../abstrations/base.entity';
import InstructorSocialMediaEntity from './instructor-social-media.entity';
import InstructorAvailabilityEntity from './intructor-availability.entity';

@Entity({ name: 'instructor' })
class InstructorEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: true })
  websideURL?: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  headline?: string;

  @Column({ type: 'jsonb', nullable: true })
  introduction?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  teachingExperience?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  motivation?: Record<string, any>;

  @OneToOne(() => NaturalPersonEntity)
  @JoinColumn({ name: 'id' })
  naturalPerson!: NaturalPersonEntity;

  @OneToMany(
    () => InstructorSocialMediaEntity,
    (instructorSocialMedia) => instructorSocialMedia.instructor
  )
  instructorSocialMedia!: InstructorSocialMediaEntity[];

  @OneToMany(
    () => InstructorAvailabilityEntity,
    (availability) => availability.instructor
  )
  availability!: InstructorAvailabilityEntity[];
}

export default InstructorEntity;
