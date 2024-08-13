import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

type ValidateError = {
  field: string;
  message: any;
};
class ValidatorMiddleware {
  static validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Map the errors to a more user-friendly format
      const formattedErrors: ValidateError[] = Object.keys(errors.mapped()).map(
        (field) => {
          const error = errors.mapped()[field];
          return {
            field: field,
            message: error.msg,
          };
        }
      );

      return res.status(400).json(formattedErrors);
      // return res.status(400).json({
      //   ok: false,
      //   errors: formattedErrors,
      // });
    }
    next();
  }
}

export default ValidatorMiddleware;
