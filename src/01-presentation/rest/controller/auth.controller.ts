import LoginCommand from '@application/features/auth/command/login/login.command';
import RegisterCommand from '@application/features/auth/command/register/register.command';
import AuthenticationResult from '@application/models/AuthenticationResult';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Mediator } from 'mediatr-ts';

@injectable()
class AuthController {
  constructor(@inject(TYPES.Mediator) private _mediator: Mediator) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  public async login(req: Request, res: Response) {
    const { email, password, username } = req.body as {
      email: string;
      password: string;
      username: string;
    };
    const command = new LoginCommand(username, email, password);
    const tokenResult: Result<AuthenticationResult, ErrorResult> =
      await this._mediator.send(command);
    return tokenResult;
  }
  public async register(req: Request, res: Response) {
    const { email, password, name } = req.body as {
      email: string;
      password: string;
      name: string;
    };
    const command = new RegisterCommand(name, email, password);
    const tokenResult = await this._mediator.send(command);
    return tokenResult;
  }
}

export default AuthController;
