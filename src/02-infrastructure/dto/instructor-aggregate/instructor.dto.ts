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
      naturalPerson: null,
      introductionText: entity.introduction,
      teachingExperienceText: entity.teachingExperience,
      motivationText: entity.motivation,
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
    entity.introduction = domain.properties.introductionText;
    entity.teachingExperience = domain.properties.teachingExperienceText;
    entity.motivation = domain.properties.motivationText;

    const instructorSocialMediaEntity = InstructorSocialMediaDTO.toEntityArray(
      domain.properties.id,
      domain.properties.socialMedia
    );

    entity.instructorSocialMedia = instructorSocialMediaEntity;
    return entity;
  }
}
export default InstructorDTO;
