import TYPES from '@config/inversify/identifiers';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Multer } from 'multer';
import sharp from 'sharp';

type MulderMiddlewareProp = {
  fieldName: string;
};

@injectable()
class MulderMiddleware {
  constructor(@inject(TYPES.Multer) private readonly _multer: Multer) {
    this.build = this.build.bind(this);
  }

  public build({
    fieldName,
  }: MulderMiddlewareProp): (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void> {
    const use = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      this._multer.single('video')(req, res, (err) => {
        if (err) {
          // Handle multer specific errors
          return res.status(400).json({
            name: err.name || 'UploadError',
            message: err.message || 'Error processing video',
            error: 'Error while processing the video',
          });
        }
        next(); // Proceed if no error
      });
    };
    return use;
  }
}

export default MulderMiddleware;
