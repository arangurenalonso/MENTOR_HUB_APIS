import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import SubCategoryDomain from '@domain/courses-aggregate/sub-category/sub-category.domain';
import SubCategoryEntity from '@persistence/entities/courses-aggregate/sub-category.entity';
import CategoryDTO from './category.dto';

class SubCategoryDTO {
  public static toDomain(
    entity: SubCategoryEntity
  ): Result<SubCategoryDomain, ErrorResult> {
    const categoryResult = CategoryDTO.toDomain(entity.category);
    if (categoryResult.isErr()) {
      return err(categoryResult.error);
    }
    const category = categoryResult.value;
    const domainResult = SubCategoryDomain.create({
      id: entity.id,
      description: entity.description,
      category,
    });
    if (domainResult.isErr()) {
      return err(domainResult.error);
    }
    return ok(domainResult.value);
  }

  public static toEntity(domain: SubCategoryDomain): SubCategoryEntity {
    const entity = new SubCategoryEntity();
    if (domain.properties.id) {
      entity.id = domain.properties.id;
    }
    entity.description = domain.properties.description;
    return entity;
  }
  public static toDomainList(
    entities: SubCategoryEntity[]
  ): Result<SubCategoryDomain[], ErrorResult> {
    const domainArray: SubCategoryDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.toDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      domainArray.push(entityResult.value);
    }
    return ok(domainArray);
  }
}
export default SubCategoryDTO;
