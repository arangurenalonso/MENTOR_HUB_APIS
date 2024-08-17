import IPasswordService from '@application/contracts/Ipassword.service';
import ITokenService from '@application/contracts/IToken.service';
import AuthApplicationErrors from '@application/errors/auth-application.error';
import AuthenticationResult from '@application/models/AuthenticationResult';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import { requestHandler, IRequestHandler, Mediator } from 'mediatr-ts';
import AuthenticationResultQuery from '../../query/authentication-result/authentication-result.query';
import ConfirmEmailVerificationCommand from './confirmEmailVerification.command';
import EmailTokenPayload from '@application/models/EmailTokenPayload';
import IPersonRepository from '@domain/persona-aggregate/root/repository/person.repository';
import IUnitOfWork from '@domain/abstract/repository/IUnitOfWork';
import PersonApplicationErrors from '@application/errors/person-application.error';
import UserApplicationErrors from '@application/errors/user-application.error';

@injectable()
@requestHandler(ConfirmEmailVerificationCommand)
class ConfirmEmailVerificationCommandHandler
  implements
    IRequestHandler<
      ConfirmEmailVerificationCommand,
      Result<AuthenticationResult, ErrorResult>
    >
{
  constructor(
    @inject(TYPES.Mediator) private _mediator: Mediator,
    @inject(TYPES.IPersonRepository)
    private _personRepository: IPersonRepository,
    @inject(TYPES.IUnitOfWork) private readonly _unitOfWork: IUnitOfWork,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService
  ) {}
  async handle(
    command: ConfirmEmailVerificationCommand
  ): Promise<Result<AuthenticationResult, ErrorResult>> {
    const emailTokenPayloadResult =
      await this._tokenService.verifyToken<EmailTokenPayload>(
        command.verificationEmailToken
      );
    if (emailTokenPayloadResult.isErr()) {
      return err(emailTokenPayloadResult.error);
    }

    const emailTokenPayload = emailTokenPayloadResult.value;

    const personResult = await this._personRepository.getPersonById(
      emailTokenPayload.idUser
    );

    if (personResult.isErr()) {
      return err(personResult.error);
    }
    const person = personResult.value;
    if (person === null) {
      return err(
        PersonApplicationErrors.PERSON_NOT_FOUND(emailTokenPayload.idUser)
      );
    }
    person.verifyEmail(emailTokenPayload.email);
    try {
      await this._unitOfWork.startTransaction();

      await this._unitOfWork.personRepository.modify(person);

      await this._unitOfWork.commit();
    } catch (error) {
      await this._unitOfWork.rollback();

      return err(UserApplicationErrors.USER_CREATE_ERROR(`${error}`));
    }
    return await this._mediator.send(
      new AuthenticationResultQuery(emailTokenPayload.idUser)
    );
  }
}
export default ConfirmEmailVerificationCommandHandler;
