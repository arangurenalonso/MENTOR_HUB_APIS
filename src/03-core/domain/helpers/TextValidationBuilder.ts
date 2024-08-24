import { err, ok, Result } from 'neverthrow';
class TextValidation {
  private _rules: string[] = [];
  private _validCharsDescriptions: string[] = [];
  private _regexPattern: RegExp;

  private constructor(
    rules: string[],
    validCharsDescriptions: string[],
    regexPattern: RegExp
  ) {
    this._rules = rules;
    this._validCharsDescriptions = validCharsDescriptions;
    this._regexPattern = regexPattern;
  }
  public static create(
    rules: string[],
    validCharsDescriptions: string[],
    regexPattern: RegExp
  ): TextValidation {
    return new TextValidation(rules, validCharsDescriptions, regexPattern);
  }

  validate(value: string): Result<void, string> {
    const valueText = value.trim();
    const invalidChars = valueText
      .split('')
      .filter((char) => !new RegExp(`[${this._rules.join('')}]`).test(char));

    if (!this._regexPattern) {
      return err('Regex pattern not found; build before validating.');
    }
    if (!this._regexPattern.test(valueText)) {
      return err(
        `Invalid characters found: ${invalidChars.join(
          ', '
        )}. Allowed characters are: ${this._validCharsDescriptions.join(', ')}`
      );
    }

    return ok(undefined);
  }
}

class TextValidationBuilder {
  private static rules: string[] = [];
  private static validCharsDescriptions: string[] = [];
  static addLowercaseLetters(): typeof TextValidationBuilder {
    this.rules.push('a-z');
    this.validCharsDescriptions.push('lowercase letters');
    return this;
  }

  static addUppercaseLetters(): typeof TextValidationBuilder {
    this.rules.push('A-Z');
    this.validCharsDescriptions.push('uppercase letters');
    return this;
  }

  static addLowercaseAccentedLetters(): typeof TextValidationBuilder {
    this.rules.push('áéíóú');
    this.validCharsDescriptions.push('lowercase letters with accents');
    return this;
  }

  static addUppercaseAccentedLetters(): typeof TextValidationBuilder {
    this.rules.push('ÁÉÍÓÚ');
    this.validCharsDescriptions.push('uppercase letters with accents');
    return this;
  }

  static addSpanishLetters(): typeof TextValidationBuilder {
    this.rules.push('ñÑ');
    this.validCharsDescriptions.push('Spanish letters (ñ, Ñ)');
    return this;
  }

  static addNumbers(): typeof TextValidationBuilder {
    this.rules.push('0-9');
    this.validCharsDescriptions.push('numbers');
    return this;
  }

  static addWhitespace(): typeof TextValidationBuilder {
    this.rules.push('\\s');
    this.validCharsDescriptions.push('spaces');
    return this;
  }

  static addPunctuation(): typeof TextValidationBuilder {
    this.rules.push("\\.,'!?¡¿;:");
    this.validCharsDescriptions.push('punctuation marks');
    return this;
  }

  static addSpecialChars(): typeof TextValidationBuilder {
    this.rules.push('@#$%&*\\-');
    this.validCharsDescriptions.push(
      'special characters (@, #, $, %, &, *, -)'
    );
    return this;
  }

  static build(): TextValidation {
    const pattern = `^[${this.rules.join('')}]+$`;
    const regexPattern = new RegExp(pattern);
    return TextValidation.create(
      this.rules,
      this.validCharsDescriptions,
      regexPattern
    );
  }
}

export default TextValidationBuilder;
