import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import CourseEntity from './course.entity';
import domainRules from '@domain/helpers/regular-exp';

@Entity('requirement')
class RequirementEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: domainRules.requirementseMaxLength,
    nullable: false,
  })
  description!: string;

  @Column({ type: 'uuid', nullable: false })
  idCourse!: string;

  @ManyToOne(() => CourseEntity, (course) => course.requirements)
  @JoinColumn({
    name: 'idCourse',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_Requirement_Course',
  })
  course!: CourseEntity;
}

export default RequirementEntity;
