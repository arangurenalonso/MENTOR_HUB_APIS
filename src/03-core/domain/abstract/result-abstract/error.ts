class ErrorResult {
  public readonly type: string;
  public readonly message: string;
  public readonly statusCode: number = 400;

  public static readonly None = new ErrorResult('', '', 0);
  public static readonly NullValue = new ErrorResult(
    'Error.NullValue',
    'The specified result value is null'
  );

  constructor(type: string, message: string, statusCode: number = 400) {
    this.type = type;
    this.message = message;
    this.statusCode = statusCode;
  }

  public equals(other: ErrorResult | null): boolean {
    if (!other) return false;
    return (
      this.type === other.type &&
      this.message === other.message &&
      this.statusCode === other.statusCode
    );
  }

  public toString(): string {
    return `${this.type}: ${this.message}`;
  }
}
export default ErrorResult;
