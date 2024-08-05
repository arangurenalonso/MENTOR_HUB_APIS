import ITokenService from '@application/contracts/IToken.service';
import TokenPayload from '@application/models/TokenPayload.model';
import Environment from '@config/enviroment';
import TYPES from '@config/inversify/identifiers';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { injectable, inject } from 'inversify';
import * as jwt from 'jsonwebtoken';
import { Result, err, ok } from 'neverthrow';
import { promisify } from 'util';
@injectable()
class TokenService implements ITokenService {
  constructor(@inject(TYPES.Environment) private readonly _env: Environment) {}

  public async generateToken(
    payload: TokenPayload
  ): Promise<Result<string, ErrorResult>> {
    try {
      const token = jwt.sign(payload, this._env.jwtSecret, {
        expiresIn: this._env.jwtExpireAccessToken,
      });
      return ok(token);

      // const token = await new Promise<string>((resolve, reject) => {
      //   jwt.sign(
      //     payload,
      //     this._env.jwtSecret,
      //     { expiresIn: this._env.jwtExpireAccessToken },
      //     (err, token) => {
      //       if (err || !token) {
      //         reject(err || new Error('Token generation failed'));
      //       } else {
      //         resolve(token);
      //       }
      //     }
      //   );
      // });
      // return ok(token);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred during token generation';

      return err(new ErrorResult('Token.Generation', errorMessage, 500));
    }
  }
  public async verifyToken(
    token: string
  ): Promise<Result<TokenPayload, ErrorResult>> {
    try {
      const decoded = await new Promise<TokenPayload>((resolve, reject) => {
        jwt.verify(token, this._env.jwtSecret, (err, decoded) => {
          if (err || !decoded) {
            reject(err || new Error('Token verification failed'));
          } else {
            resolve(decoded as TokenPayload);
          }
        });
      });
      return ok(decoded);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      return err(new ErrorResult('Token.Verification', errorMessage, 401));
    }
  }
}

export default TokenService;
