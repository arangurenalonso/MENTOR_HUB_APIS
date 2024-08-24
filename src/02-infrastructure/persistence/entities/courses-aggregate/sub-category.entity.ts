import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from '../abstrations/base.entity';
import CategoryEntity from './category.entity';

@Entity('sub_category')
class SubCategoryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
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
}

export default SubCategoryEntity;
