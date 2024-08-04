import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import PersonEntity from '@persistence/entities/person-aggreagte/person.entity';
import NaturalPersonDomain from '@domain/persona-aggregate/natural-person/natural-person.domain';
import PersonTypeEnum from '@domain/persona-aggregate/root/enum/person-type.enum';
import PersonInfrastructureError from '../error/user-error';
import EmailEntity from '@persistence/entities/person-aggreagte/email.entity';
import NaturalPersonEntity from '@persistence/entities/person-aggreagte/natural_person.entity';

class PersonDTO {
  //   private static convertEmailEntityToEmailDomain(
  //     emailsEntity: EmailEntity[]
  //   ): Result<EmailDomain[], ErrorResult> {
  //     const emailDomains: EmailDomain[] = [];
  //     for (const emailEntity of emailsEntity) {
  //       const emailDomainResult = EmailDomain.create({
  //         id: emailEntity.id,
  //         email_address: emailEntity.emailAddress,
  //         is_primary: emailEntity.isPrimary,
  //         is_verified: emailEntity.isVerified,
  //         verification_token: emailEntity.verificationToken,
  //       });
  //       if (emailDomainResult.isErr()) {
  //         return err(emailDomainResult.error);
  //       }
  //       emailDomains.push(emailDomainResult.value);
  //     }
  //     return ok(emailDomains);
  //   }

  public static toDomain(
    entity?: PersonEntity | null
  ): Result<NaturalPersonDomain | null, ErrorResult> {
    // const emailsResult = this.convertEmailEntityToEmailDomain(entity.emails);
    // if (emailsResult.isErr()) {
    //   return err(emailsResult.error);
    // }
    // const email = emailsResult.value;
    if (!entity) {
      return ok(null);
    }
    if (entity.personType == PersonTypeEnum.NATURAL) {
      const naturalPersonDomainResult = NaturalPersonDomain.create({
        id: entity.id,
        name: entity.naturalPerson!.name,
        birthdate: entity.naturalPerson?.birthdate,
        email: entity.emails.map((x) => {
          return {
            id: x.id,
            email_address: x.emailAddress,
            is_primary: x.isPrimary,
            is_verified: x.isVerified,
            verification_token: x.verificationToken,
          };
        }),
      });

      if (naturalPersonDomainResult.isErr()) {
        return err(naturalPersonDomainResult.error);
      }
      const naturalPersonDomain = naturalPersonDomainResult.value;
      return ok(naturalPersonDomain);
    }
    return err(PersonInfrastructureError.PERSON_TYPE_NOT_FOUND);
  }

  public static toEntity(
    domain: NaturalPersonDomain
  ): Result<PersonEntity, ErrorResult> {
    const entity = new PersonEntity();

    entity.id = domain.properties.id;
    entity.personType = domain.properties.personType;

    const emailsEntity = domain.properties.emails.map((emailDomain) => {
      const emailEntity = new EmailEntity();
      emailEntity.id = emailDomain.id;
      emailEntity.emailAddress = emailDomain.email_address;
      emailEntity.isPrimary = emailDomain.is_primary;
      emailEntity.isVerified = emailDomain.is_verified;
      emailEntity.verificationToken = emailDomain.verification_token;
      emailEntity.idPerson = domain.properties.id;
      return emailEntity;
    });
    entity.emails = emailsEntity;
    if (domain.properties.personType == PersonTypeEnum.NATURAL) {
      const naturalPerson = new NaturalPersonEntity();
      naturalPerson.id = domain.properties.id;
      naturalPerson.name = domain.properties.name;
      naturalPerson.birthdate = domain.properties.birthdate;

      entity.naturalPerson = naturalPerson;
    } else if (domain.properties.personType == PersonTypeEnum.JURIDICA) {
    } else {
      return err(PersonInfrastructureError.PERSON_TYPE_NOT_FOUND);
    }
    return ok(entity);
  }
}
export default PersonDTO;
