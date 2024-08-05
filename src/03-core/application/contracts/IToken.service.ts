import TokenPayload from '@application/models/TokenPayload.model';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { Result } from 'neverthrow';

interface ITokenService {
  generateToken(payload: TokenPayload): Promise<Result<string, ErrorResult>>;
  verifyToken(token: string): Promise<Result<TokenPayload, ErrorResult>>;
}

export default ITokenService;
