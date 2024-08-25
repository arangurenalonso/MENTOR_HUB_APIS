import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import CategoryEntity from '@persistence/entities/courses-aggregate/category.entity';
import CategoryDomain from '@domain/courses-aggregate/category/category.domain';

class CategoryDTO {
  public static toDomain(
    entity: CategoryEntity
  ): Result<CategoryDomain, ErrorResult> {
    const domainResult = CategoryDomain.create({
      id: entity.id,
      description: entity.description,
    });
    if (domainResult.isErr()) {
      return err(domainResult.error);
    }
    return ok(domainResult.value);
  }

  public static toEntity(domain: CategoryDomain): CategoryEntity {
    const entity = new CategoryEntity();
    if (domain.properties.id) {
      entity.id = domain.properties.id;
    }
    entity.description = domain.properties.description;
    return entity;
  }
  public static toDomainList(
    entities: CategoryEntity[]
  ): Result<CategoryDomain[], ErrorResult> {
    const domainArray: CategoryDomain[] = [];
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
export default CategoryDTO;
