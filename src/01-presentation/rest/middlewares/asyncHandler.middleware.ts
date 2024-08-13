import { Err, err, ok, Result } from 'neverthrow';
import { ErrorResult } from '@domain/abstract/result-abstract';
import { Request, Response, NextFunction } from 'express';

type errorData = {
  type: string;
  error: string;
  stack?: string;
};
function isResult(input: any): input is Result<any, ErrorResult> {
  return (
    input &&
    (input.value !== undefined ||
      (input.error !== undefined && input.error instanceof ErrorResult))
  );
}
const asyncHandlerMiddleware = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Result<any, ErrorResult> | any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res, next);
      if (isResult(result)) {
        if (result.isOk()) {
          res.status(200).json(result.value);
        } else {
          const errorData: errorData = {
            type: result.error.type,
            error: result.error.message,
          };
          res.status(result.error.statusCode).json(errorData);
        }
      } else {
        res.json(result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `${error}`;
      const errorStack = error instanceof Error ? error.stack : '';
      const errorData: errorData = {
        type: 'Internal Server Error',
        error: `Unexpected error: ${errorMessage}`,
        stack: errorStack,
      };
      res.status(500).json(errorData);
    }
  };
};

export default asyncHandlerMiddleware;
