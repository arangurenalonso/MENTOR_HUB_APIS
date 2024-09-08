import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import CourseEntity from './course.entity';
import domainRules from '@domain/helpers/regular-exp';

@Entity('intended_learner')
class IntendedLearnerEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: domainRules.intendedLearnersseMaxLength,
    nullable: false,
  })
  description!: string;

  @Column({ type: 'uuid', nullable: false })
  idCourse!: string;

  @ManyToOne(() => CourseEntity, (course) => course.intendedLearners)
  @JoinColumn({
    name: 'idCourse',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_IntendedLearner_Course',
  })
  course!: CourseEntity;
}

export default IntendedLearnerEntity;
