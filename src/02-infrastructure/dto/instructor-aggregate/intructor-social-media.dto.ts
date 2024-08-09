import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import SocialMediaDomain, {
  SocialMediaDomainProperties,
} from '@domain/intructor-aggregate/social-media/social-media.domain';
import InstructorSocialMediaEntity from '@persistence/entities/instructor-aggregate/instructor-social-media.entity';

class InstructorSocialMediaDTO {
  public static ToDomain(
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

  public static ToDomainArray(
    entities?: InstructorSocialMediaEntity[] | null
  ): Result<SocialMediaDomain[], ErrorResult> {
    if (!entities) {
      return ok([]);
    }
    const socialMediaDomain: SocialMediaDomain[] = [];
    for (const entity of entities) {
      const entityResult = this.ToDomain(entity);
      if (entityResult.isErr()) {
        return err(entityResult.error);
      }
      socialMediaDomain.push(entityResult.value);
    }
    return ok(socialMediaDomain);
  }
  public static toEntity(
    idInstructor: string,
    domain: SocialMediaDomainProperties
  ): InstructorSocialMediaEntity {
    const socialMediaEntity = new InstructorSocialMediaEntity();
    socialMediaEntity.id = domain.idRelation;
    socialMediaEntity.idInstructor = idInstructor;
    socialMediaEntity.idSocialMedia = domain.id;
    socialMediaEntity.urlProfile = domain.urlProfile;
    return socialMediaEntity;
  }

  public static toEntityArray(
    idInstructor: string,
    domainArray: SocialMediaDomainProperties[] = []
  ): InstructorSocialMediaEntity[] {
    return domainArray.map((domain) => this.toEntity(idInstructor, domain));
  }
}
export default InstructorSocialMediaDTO;
