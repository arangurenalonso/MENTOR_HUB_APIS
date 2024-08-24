import { err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import messagesValidator from '@domain/helpers/messages-validator';

class RichTextJsonContent {
  private readonly _value: object;
  private readonly _totalWords: number;

  private constructor(value: object, totalWords: number) {
    this._value = value;
    this._totalWords = totalWords;
  }

  public static create(
    type: string,
    value?: string | null
  ): Result<RichTextJsonContent | null, ErrorResult> {
    if (value === null || value === undefined || value === '') {
      return ok(null);
    }

    const parsedValueResult = this.isValidJson(type, value);
    if (parsedValueResult.isErr()) return err(parsedValueResult.error);
    const parsedValue = parsedValueResult.value;

    const structureResult = RichTextJsonContent.isValidStructure(parsedValue);
    if (structureResult.isErr()) return err(structureResult.error);

    const totalWords = RichTextJsonContent.calculateTotalWords(parsedValue);

    return ok(new RichTextJsonContent(parsedValue, totalWords));
  }
  private static isValidJson(
    type: string,
    value: string
  ): Result<object, ErrorResult> {
    try {
      const parsedValue: object = JSON.parse(value);
      return ok(parsedValue);
    } catch (error) {
      return err(
        new ErrorResult(
          `${type.toUpperCase()}_INVALID_JSON`,
          messagesValidator.object(type),
          400
        )
      );
    }
  }

  private static isValidStructure(json: object): Result<object, ErrorResult> {
    const jsonAsAny = json as any;

    if (!Array.isArray(jsonAsAny.blocks)) {
      return err(
        new ErrorResult(
          `INVALID_STRUCTURE`,
          messagesValidator.invalidFormat('JSON blocks'),
          400
        )
      );
    }

    for (const block of jsonAsAny.blocks) {
      if (
        typeof block.key !== 'string' ||
        typeof block.text !== 'string' ||
        typeof block.type !== 'string' ||
        typeof block.depth !== 'number' ||
        !Array.isArray(block.inlineStyleRanges) ||
        !Array.isArray(block.entityRanges) ||
        typeof block.data !== 'object'
      ) {
        return err(
          new ErrorResult(
            `INVALID_STRUCTURE`,
            messagesValidator.invalidFormat('Block structure'),
            400
          )
        );
      }
    }

    if (typeof jsonAsAny.entityMap !== 'object') {
      return err(
        new ErrorResult(
          `INVALID_STRUCTURE`,
          messagesValidator.invalidFormat('Entity map'),
          400
        )
      );
    }

    return ok(json);
  }

  private static calculateTotalWords(json: any): number {
    return json.blocks.reduce((total: number, block: any) => {
      return total + block.text.trim().length;
    }, 0);
  }

  get value(): object {
    return this._value;
  }
  get totalWords(): number {
    return this._totalWords;
  }
  public equals(other: RichTextJsonContent): boolean {
    return JSON.stringify(this._value) === JSON.stringify(other.value);
  }

  public toString(): string {
    return JSON.stringify(this._value);
  }
}

export default RichTextJsonContent;
