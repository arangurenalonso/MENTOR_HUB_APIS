import { Entity, Column, OneToMany } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import domainRules from '@domain/helpers/regular-exp';
import CourseEntity from './course.entity';
@Entity('level')
class LevelEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: domainRules.levelDescriptionMaxLength,
    nullable: false,
  })
  description!: string;

  @OneToMany(() => CourseEntity, (course) => course.level)
  courses!: CourseEntity[];
}

export default LevelEntity;
