import IEmailService from '@application/contracts/IEmail.service';
import ITokenService from '@application/contracts/IToken.service';
import PersonApplicationErrors from '@application/errors/person-application.error';
import Environment from '@config/enviroment';
import TYPES from '@config/inversify/identifiers';
import NaturalPersonDomain from '@domain/persona-aggregate/natural-person/natural-person.domain';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';
import UserCreatedDomainEvent from '@domain/user-aggregate/root/events/user-created.domain-event';
import IUserRepository from '@domain/user-aggregate/root/repositories/IUser.repository';
import UserDomain from '@domain/user-aggregate/root/user.domain';
import NaturalPersonEntity from '@persistence/entities/person-aggreagte/natural_person.entity';
import { id, inject, injectable } from 'inversify';
import { notificationHandler, INotificationHandler } from 'mediatr-ts';
import { err } from 'neverthrow';
import EmailTokenPayload from '../../../../models/EmailTokenPayload';

@notificationHandler(UserCreatedDomainEvent)
@injectable()
class UserCreatedDomainEventHandler
  implements INotificationHandler<UserCreatedDomainEvent>
{
  constructor(
    @inject(TYPES.Environment) private _envs: Environment,
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IPersonRepository)
    private _personRepository: IPersonRepository,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
    @inject(TYPES.IEmailService) private _emailService: IEmailService
  ) {}
  async handle(notification: UserCreatedDomainEvent): Promise<void> {
    const user = await this.getUser(notification.idUser);
    const person = await this.getPerson(notification.idUser);
    await this.sendEmailValidationLink(user, person);
  }
  private async getUser(id?: string): Promise<UserDomain> {
    let user: UserDomain | null = null;
    if (id) {
      const userResult = await this._userRepository.getUserById(id);
      if (userResult.isErr()) {
        throw new Error(userResult.error.toString());
      }
      user = userResult.value;
    }
    if (!user) {
      throw new Error(`user not found. id: '${id}'`);
    }
    return user;
  }
  private async getPerson(id: string): Promise<NaturalPersonDomain> {
    const personResult = await this._personRepository.getPersonById(id);
    if (personResult.isErr()) {
      throw new Error(personResult.error.toString());
    }
    const person = personResult.value;
    if (person === null) {
      throw new Error(`Person not found. id: '${id}'`);
    }
    return person;
  }
  private sendEmailValidationLink = async (
    userDomain: UserDomain,
    person: NaturalPersonDomain
  ) => {
    const email = userDomain.properties.email;
    const emailFinded = person.properties.emails.find(
      (x) => x.email_address.trim().toLowerCase() == email.trim().toLowerCase()
    );
    if (!emailFinded) {
      throw new Error(
        PersonApplicationErrors.EMAIL_NOT_FOUND(
          email,
          person.properties.id
        ).toString()
      );
    }

    const tokenResult = await this._tokenService.generateToken({
      idUser: userDomain.properties.id!,
      email: userDomain.properties.email,
    });
    if (tokenResult.isErr()) {
      throw new Error(tokenResult.error.toString());
    }
    const token = tokenResult.value;
    const link = `${this._envs.webserviceUrl}/auth/validate-email/${token}`;
    const html = `
      <h1>Welcome: ${person.properties.name}</h1>
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${userDomain.properties.email}</a>
    `;

    const isSent = await this._emailService.sendEmail(
      userDomain.properties.email!,
      'Validate your email',
      html
    );
    console.log('email sent', isSent);

    return true;
  };
}
export default UserCreatedDomainEventHandler;
