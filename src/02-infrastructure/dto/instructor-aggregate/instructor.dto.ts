import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import SocialMediaDomain from '@domain/intructor-aggregate/social-media/social-media.domain';
import InstructorSocialMediaEntity from '@persistence/entities/instructor-aggregate/instructor-social-media.entity';
import InstructorEntity from '@persistence/entities/instructor-aggregate/instructor.entity';
import InstructorDomain from '@domain/intructor-aggregate/root/instructor.domain';

class InstructorDTO {
  public static socialMediaToDomain(
    entity: InstructorSocialMediaEntity
  ): Result<SocialMediaDomain, ErrorResult> {
    const domainResult = SocialMediaDomain.create({
      id: entity.id,
      description: entity.socialMedia.description,
      baseUrl: entity.socialMedia.baseURL,
      urlmage: entity.socialMedia.urlmage,
      urlProfile: entity.urlProfile,
      idRelation: entity.id,
    });
    if (domainResult.isErr()) {
      return err(domainResult.error);
    }
    return ok(domainResult.value);
  }

  public static socialMediaToDomainArray(
    entities?: InstructorSocialMediaEntity[] | null
  ): Result<SocialMediaDomain[], ErrorResult> {
    if (!entities) {
      return ok([]);
    }
    const socialMediaDomain: SocialMediaDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.socialMediaToDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      socialMediaDomain.push(entityResult.value);
    }
    return ok(socialMediaDomain);
  }
  public static toDomain(
    entity: InstructorEntity
  ): Result<InstructorDomain, ErrorResult> {
    const socialMediaResult = this.socialMediaToDomainArray(
      entity.instructorSocialMedia
    );
    if (socialMediaResult.isErr()) {
      return err(socialMediaResult.error);
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

    const instructorSocialMediaEntity = domain.properties.socialMedia.map(
      (x) => {
        const socialMediaEntity = new InstructorSocialMediaEntity();
        socialMediaEntity.id = x.idRelation;
        socialMediaEntity.idInstructor = domain.properties.id;
        socialMediaEntity.idSocialMedia = x.id;
        socialMediaEntity.urlProfile = x.urlProfile;
        return socialMediaEntity;
      }
    );
    entity.instructorSocialMedia = instructorSocialMediaEntity;
    return entity;
  }
}
export default InstructorDTO;
