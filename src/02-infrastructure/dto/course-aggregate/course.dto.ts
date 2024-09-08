import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import CourseEntity from '@persistence/entities/courses-aggregate/course.entity';
import CourseDomain from '@domain/courses-aggregate/root/course.domain';
import LearningObjectiveDTO from './learning-objective.dto';
import IntendedLearnerDTO from './intended-learner.dto';
import RequirementDTO from './requirement.dto';
import SubCategoryDTO from './sub-category.dto';
import LevelDTO from './level.dto';
import InstructorId from '@domain/intructor-aggregate/root/value-object/instructor-id.value-object';

class CourseDTO {
  public static toDomain(
    entity: CourseEntity
  ): Result<CourseDomain, ErrorResult> {
    const learningObjectivesResult = LearningObjectiveDTO.toDomainArray(
      entity.learningObjectives
    );
    if (learningObjectivesResult.isErr()) {
      return err(learningObjectivesResult.error);
    }
    const intendedLearnersResult = IntendedLearnerDTO.toDomainArray(
      entity.intendedLearners
    );
    if (intendedLearnersResult.isErr()) {
      return err(intendedLearnersResult.error);
    }
    const requirementResult = RequirementDTO.toDomainArray(entity.requirements);
    if (requirementResult.isErr()) {
      return err(requirementResult.error);
    }
    const subCategoryResult = SubCategoryDTO.toDomain(entity.subCategory);
    if (subCategoryResult.isErr()) {
      return err(subCategoryResult.error);
    }
    const levelResult = LevelDTO.toDomain(entity.level);
    if (levelResult.isErr()) {
      return err(levelResult.error);
    }
    const instructorIdResult = InstructorId.create(entity.idInstructor);
    if (instructorIdResult.isErr()) {
      return err(instructorIdResult.error);
    }

    const learningObjectives = learningObjectivesResult.value;
    const intendedLearners = intendedLearnersResult.value;
    const requirements = requirementResult.value;
    const subCategory = subCategoryResult.value;
    const level = levelResult.value;
    const instructorId = instructorIdResult.value;

    const domainResult = CourseDomain.create({
      id: entity.id!,
      title: entity.title,
      description: JSON.stringify(entity.description),
      idInstructor: instructorId,
      level,
      subCategory,
      learningObjectives,
      intendedLearners,
      requirements,
      imgS3Key: entity.imgS3Key || null,
      promotionalVideoS3Key: entity.promotionalVideoS3Key || null,
    });
    if (domainResult.isErr()) {
      return err(domainResult.error);
    }
    return ok(domainResult.value);
  }
  public static toDomainList(
    entities: CourseEntity[]
  ): Result<CourseDomain[], ErrorResult> {
    const domainArray: CourseDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.toDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      domainArray.push(entityResult.value);
    }
    return ok(domainArray);
  }
  public static toEntity(domain: CourseDomain): CourseEntity {
    const entity = new CourseEntity();
    entity.id = domain.properties.id;
    entity.idInstructor = domain.properties.idInstructor;
    entity.title = domain.properties.title;
    entity.imgS3Key = domain.imgS3Key || undefined;
    entity.promotionalVideoS3Key = domain.promotionalVideoS3Key || undefined;

    entity.description = JSON.parse(domain.properties.description);
    entity.idSubCategory = domain.properties.subCategory.id;
    entity.idLevel = domain.properties.level.id;

    return entity;
  }
}
export default CourseDTO;
