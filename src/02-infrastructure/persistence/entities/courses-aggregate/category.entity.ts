import { Entity, Column, OneToMany } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import SubCategoryEntity from './sub-category.entity';

@Entity('category')
class CategoryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  description!: string;

  @OneToMany(() => SubCategoryEntity, (subCategory) => subCategory.category)
  subCategories!: SubCategoryEntity[];
}

export default CategoryEntity;
