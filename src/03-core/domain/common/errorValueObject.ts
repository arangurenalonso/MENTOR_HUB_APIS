import { ErrorResult } from '@domain/abstract/result-abstract';

class ErrorValueObject {
  private readonly PREFIX: string;
  private readonly SUB_PREFIX: string;
  private readonly PREFIX_CAMEL_CASE: string;
  private readonly SUB_PREFIX_CAMEL_CASE: string;

  constructor(prefix: string, subPrefix: string) {
    this.PREFIX = prefix;
    this.PREFIX_CAMEL_CASE = this.stringToPascalCase();
    this.SUB_PREFIX = subPrefix;
    this.SUB_PREFIX_CAMEL_CASE = this.stringToPascalCase();
  }
  private stringToPascalCase(): string {
    let formattedText = this.PREFIX.toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ');

    formattedText = formattedText
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return formattedText;
  }

  public buildError(reasons: string | string[]): ErrorResult {
    const reasonsMessage = Array.isArray(reasons)
      ? reasons.join(', ')
      : reasons;

    return new ErrorResult(
      `${this.PREFIX}.${this.SUB_PREFIX}`,
      `${this.PREFIX_CAMEL_CASE} ${this.SUB_PREFIX_CAMEL_CASE} is invalid: ${reasonsMessage}`,
      400
    );
  }
}

export default ErrorValueObject;
