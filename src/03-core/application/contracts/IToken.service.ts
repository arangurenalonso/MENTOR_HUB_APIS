import EmailTokenPayload from '@application/models/EmailTokenPayload';
import RefreshTokenPayload from '@application/models/RefreshTokenPayload';
import TokenPayload from '@application/models/TokenPayload.model';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { Result } from 'neverthrow';

interface ITokenService {
  generateToken(
    payload: TokenPayload | EmailTokenPayload
  ): Promise<Result<string, ErrorResult>>;
  generateRefreshToken(
    payload: RefreshTokenPayload
  ): Promise<Result<string, ErrorResult>>;
  verifyToken<T>(token: string): Promise<Result<T, ErrorResult>>;
}

export default ITokenService;
