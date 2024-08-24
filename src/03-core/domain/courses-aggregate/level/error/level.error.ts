import { ErrorResult } from '@domain/abstract/result-abstract';

class LevelErrors {
  private static readonly LEVEL_PREFIX = 'LEVEL';

  private static prefixToCamelCase(): string {
    let formattedText = this.LEVEL_PREFIX.toLowerCase();
    formattedText =
      formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
    return formattedText;
  }
  static readonly INVALID_ID = (id?: string): ErrorResult => {
    const idMessage = id ? ` "${id}"` : '';
    return new ErrorResult(
      `${this.LEVEL_PREFIX}.ID`,
      `${this.prefixToCamelCase()} ID${idMessage} is not a valid ID`,
      400
    );
  };
  static readonly INVALID_DESCRIPTION = (reasons: string[]): ErrorResult => {
    return new ErrorResult(
      `${this.LEVEL_PREFIX}.DESCRIPTION`,
      `${this.prefixToCamelCase()} description is invalid: ${reasons.join(
        ', '
      )}`,
      400
    );
  };
}

export default LevelErrors;
