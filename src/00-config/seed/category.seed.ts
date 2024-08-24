import { injectable, inject } from 'inversify';
import { DataSource } from 'typeorm';
import TYPES from '@config/inversify/identifiers';
import CategoryEntity from '@persistence/entities/courses-aggregate/category.entity';
import { categoryData } from './data/category.data';
import SubCategoryEntity from '@persistence/entities/courses-aggregate/sub-category.entity';
import { subCategoryData } from './data/sub-category.data';

@injectable()
class CategorySeeder {
  private dataSource: DataSource;

  constructor(@inject(TYPES.DataSource) dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async seedData(): Promise<void> {
    await this.seedDataCategory();
    await this.seedDataSubCategory();
  }
  async seedDataCategory(): Promise<void> {
    const categoryRepository = this.dataSource.getRepository(CategoryEntity);

    const count = await categoryRepository.count();

    if (count > 0) {
      console.log('Data already exists in category table. Skipping seed.');
      return;
    }

    const categoryDataToInsert = categoryData.map((x) => {
      const categoryEntity = new CategoryEntity();

      categoryEntity.id = x.id;
      categoryEntity.description = x.description;

      return categoryEntity;
    });
    await categoryRepository.save(categoryDataToInsert);
    console.log(`Seeded ${categoryDataToInsert.length} category successfully.`);
  }
  async seedDataSubCategory(): Promise<void> {
    const subCategoryRepository =
      this.dataSource.getRepository(SubCategoryEntity);

    const count = await subCategoryRepository.count();

    if (count > 0) {
      console.log('Data already exists in sub-category table. Skipping seed.');
      return;
    }

    const subCategoryDataToInsert = subCategoryData.map((x) => {
      const subCategoryEntity = new SubCategoryEntity();

      subCategoryEntity.id = x.id;
      subCategoryEntity.description = x.description;
      subCategoryEntity.idCategory = x.idCategory;

      return subCategoryEntity;
    });
    await subCategoryRepository.save(subCategoryDataToInsert);
    console.log(
      `Seeded ${subCategoryDataToInsert.length} sub-category successfully.`
    );
  }
}

export default CategorySeeder;
