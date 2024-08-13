import LoginCommand from '@application/features/auth/command/login/login.command';
import RegisterCommand from '@application/features/auth/command/register/register.command';
import AuthenticationResult from '@application/models/AuthenticationResult';
import TYPES from '@config/inversify/identifiers';
import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Mediator } from 'mediatr-ts';
import { ProviderEnum } from '@domain/user-aggregate/provider/enum/provider.enum';
import SocialProviderCommand from '@application/features/auth/command/social-provider/social-provider.command';

@injectable()
class AuthController {
  constructor(@inject(TYPES.Mediator) private _mediator: Mediator) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.socialProvider = this.socialProvider.bind(this);
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
    const { email, password, name, timeZone } = req.body as {
      email: string;
      password: string;
      name: string;
      timeZone: string;
    };

    const command = new RegisterCommand(name, email, password, timeZone);
    const tokenResult = await this._mediator.send(command);
    return tokenResult;
  }
  public async socialProvider(req: Request, res: Response) {
    const { name, email, photoURL, uid, timeZone } = req.body as {
      email: string;
      name: string;
      photoURL: string;
      uid: string;
      timeZone: string;
    };
    const { provider } = req.params as {
      provider: ProviderEnum;
    };

    const command = new SocialProviderCommand(
      name,
      email,
      uid,
      provider,
      timeZone,
      photoURL
    );
    const tokenResult = await this._mediator.send(command);
    return tokenResult;
  }
}

export default AuthController;
