import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import CategoryEntity from './category.entity';
import CourseEntity from './course.entity';
import domainRules from '@domain/helpers/regular-exp';

@Entity('sub_category')
class SubCategoryEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: domainRules.subCategoryMaxLength,
    nullable: false,
  })
  description!: string;

  @Column({ type: 'uuid', nullable: false })
  idCategory!: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subCategories)
  @JoinColumn({
    name: 'idCategory',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_Category_SubCategory',
  })
  category!: CategoryEntity;

  @OneToMany(() => CourseEntity, (course) => course.subCategory)
  courses!: CourseEntity[];
}

export default SubCategoryEntity;
