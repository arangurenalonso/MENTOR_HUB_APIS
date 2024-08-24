import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import InstructorEntity from '@persistence/entities/instructor-aggregate/instructor.entity';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';
import InstructorSocialMediaDTO from './intructor-social-media.dto';
import InstructorAvailabilityDTO from './instructor-availability';

class InstructorDTO {
  public static toDomain(
    entity: InstructorEntity
  ): Result<InstructorDomain, ErrorResult> {
    const socialMediaResult = InstructorSocialMediaDTO.ToDomainArray(
      entity.instructorSocialMedia
    );
    if (socialMediaResult.isErr()) {
      return err(socialMediaResult.error);
    }
    const instructorAvailabilityResult =
      InstructorAvailabilityDTO.toDomainArray(entity.availability);
    if (instructorAvailabilityResult.isErr()) {
      return err(instructorAvailabilityResult.error);
    }
    const socialMedia = socialMediaResult.value;

    const domainResult = InstructorDomain.create({
      id: entity.id!,
      websideURL: entity.websideURL,
      headline: entity.headline,
      socialMedia: socialMedia,
      // naturalPerson: null,
      introductionText: entity.introduction
        ? JSON.stringify(entity.introduction)
        : null,
      teachingExperienceText: entity.teachingExperience
        ? JSON.stringify(entity.teachingExperience)
        : null,
      motivationText: entity.motivation
        ? JSON.stringify(entity.motivation)
        : null,
      availability: instructorAvailabilityResult.value,
    });
    if (domainResult.isErr()) {
      return err(domainResult.error);
    }
    return ok(domainResult.value);
  }

  public static toEntity(domain: InstructorDomain): InstructorEntity {
    const entity = new InstructorEntity();
    entity.id = domain.properties.id;
    entity.websideURL = domain.properties.websideURL || undefined;
    entity.headline = domain.properties.headline || undefined;
    entity.introduction = domain.properties.introductionText
      ? JSON.parse(domain.properties.introductionText)
      : undefined;
    entity.teachingExperience = domain.properties.teachingExperienceText
      ? JSON.parse(domain.properties.teachingExperienceText)
      : undefined;
    entity.motivation = domain.properties.motivationText
      ? JSON.parse(domain.properties.motivationText)
      : undefined;

    const instructorSocialMediaEntity = InstructorSocialMediaDTO.toEntityArray(
      domain.properties.id,
      domain.properties.socialMedia
    );

    entity.instructorSocialMedia = instructorSocialMediaEntity;

    const instructorAvailabilityEntity =
      InstructorAvailabilityDTO.toEntityArray(
        domain.properties.id,
        domain.properties.availability
      );
    entity.availability = instructorAvailabilityEntity;

    return entity;
  }
}
export default InstructorDTO;
