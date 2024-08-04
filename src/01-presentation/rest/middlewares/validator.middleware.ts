import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

class ValidatorMiddleware {
  static validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Map the errors to a more user-friendly format
      const formattedErrors = Object.keys(errors.mapped()).map((field) => {
        const error = errors.mapped()[field];
        return {
          field: field,
          message: error.msg,
        };
      });

      return res.status(400).json({
        ok: false,
        errors: formattedErrors,
      });
    }
    next();
  }
}

export default ValidatorMiddleware;
