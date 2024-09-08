import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import CourseEntity from './course.entity';
import domainRules from '@domain/helpers/regular-exp';

@Entity('learning_objective')
class LearningObjectiveEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: domainRules.learningObjectiveMaxLength,
    nullable: false,
  })
  description!: string;

  @Column({ type: 'uuid', nullable: false })
  idCourse!: string;

  @ManyToOne(() => CourseEntity, (course) => course.learningObjectives)
  @JoinColumn({
    name: 'idCourse',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_LearningObjective_Course',
  })
  course!: CourseEntity;
}

export default LearningObjectiveEntity;
