import LoginCommand from '@application/features/auth/command/login/login.command';
import RegisterCommand from '@application/features/auth/command/register/register.command';
import AuthenticationResult from '@application/models/AuthenticationResult';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Mediator } from 'mediatr-ts';
import TokenPayload from '@application/models/TokenPayload.model';

@injectable()
class InstructorController {
  constructor(@inject(TYPES.Mediator) private _mediator: Mediator) {
    this.createProfile = this.createProfile.bind(this);
  }

  public async createProfile(req: Request, res: Response) {
    const { email, password, username } = req.body as {
      email: string;
      password: string;
      username: string;
    };
    // Accediendo al usuario conectado desde res.locals.user
    const connectedUser = res.locals.user as TokenPayload;

    // Ahora puedes usar connectedUser en tu lógica
    // const command = new LoginCommand(username, email, password);
    // const tokenResult: Result<AuthenticationResult, ErrorResult> =
    //   await this._mediator.send(command);
    // return tokenResult;
    return connectedUser;
  }
}

export default InstructorController;
