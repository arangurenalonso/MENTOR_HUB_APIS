import { Entity, Column, OneToMany } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import SubCategoryEntity from './sub-category.entity';
import domainRules from '@domain/helpers/regular-exp';

@Entity('category')
class CategoryEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: domainRules.categoryMaxLength,
    nullable: false,
  })
  description!: string;

  @OneToMany(() => SubCategoryEntity, (subCategory) => subCategory.category)
  subCategories!: SubCategoryEntity[];
}

export default CategoryEntity;
