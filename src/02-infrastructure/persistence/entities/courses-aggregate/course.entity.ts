import { Entity, OneToMany, Column, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import domainRules from '@domain/helpers/regular-exp';
import LearningObjectiveEntity from './learning-objective.entity';
import IntendedLearnerEntity from './intended-learners.entity';
import RequirementEntity from './requirement.entity';
import SubCategoryEntity from './sub-category.entity';
import LevelEntity from './level.entity';
import InstructorEntity from '../instructor-aggregate/instructor.entity';

@Entity({ name: 'course' })
class CourseEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: domainRules.courseTitleMaxLength,
    nullable: false,
  })
  title!: string;

  @Column({ type: 'jsonb', nullable: false })
  description?: Record<string, any>;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  imgS3Key?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  promotionalVideoS3Key?: string;

  @Column({ type: 'uuid', nullable: false })
  idInstructor!: string;

  @ManyToOne(() => InstructorEntity, (instructor) => instructor.courses)
  @JoinColumn({
    name: 'idInstructor',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_Course_Instructor',
  })
  instructor!: InstructorEntity;

  @Column({ type: 'uuid', nullable: false })
  idLevel!: string;

  @ManyToOne(() => LevelEntity, (level) => level.courses)
  @JoinColumn({
    name: 'idLevel',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_Course_Level',
  })
  level!: LevelEntity;

  @Column({ type: 'uuid', nullable: false })
  idSubCategory!: string;

  @ManyToOne(() => SubCategoryEntity, (subCategory) => subCategory.courses)
  @JoinColumn({
    name: 'idSubCategory',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_Course_SubCategory',
  })
  subCategory!: SubCategoryEntity;

  @OneToMany(
    () => LearningObjectiveEntity,
    (learningObjective) => learningObjective.course
  )
  learningObjectives!: LearningObjectiveEntity[];

  @OneToMany(
    () => IntendedLearnerEntity,
    (intendedLearner) => intendedLearner.course
  )
  intendedLearners!: IntendedLearnerEntity[];

  @OneToMany(() => RequirementEntity, (requirement) => requirement.course)
  requirements!: RequirementEntity[];
}

export default CourseEntity;
