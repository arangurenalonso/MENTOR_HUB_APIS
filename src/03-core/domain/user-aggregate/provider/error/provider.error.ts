import { ErrorResult } from '@domain/abstract/result-abstract';

class ProvidersErrors {
  static readonly INVALID_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      'PROVIDER.ID',
      `Provider ID${idMessage} is not a valid ID`,
      400
    );
  };
  static readonly INVALID_PROVIDER_NAME = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'USER.PROVIDER_NAME',
      `Provider Name is not valid: ${reasonsMessage}`,
      400
    );
  };
  static readonly INVALID_PROVIDER_UID = (reasons: string[]): ErrorResult => {
    const reasonsMessage = reasons.join('; ');
    return new ErrorResult(
      'USER.PROVIDER_UID',
      `Provider UID is not valid: ${reasonsMessage}`,
      400
    );
  };
}

export default ProvidersErrors;
