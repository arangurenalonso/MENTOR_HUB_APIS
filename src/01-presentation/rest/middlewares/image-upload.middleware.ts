import TYPES from '@config/inversify/identifiers';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Multer } from 'multer';
import sharp from 'sharp';

type ImageUploadValidationBuildProp = {
  maxSizeInMB?: number;
  dimension?: { width: number; height: number };
  allowedTypes?: string[];
  fieldName: string;
};

@injectable()
class ImageUploadValidation {
  constructor(@inject(TYPES.Multer) private readonly _multer: Multer) {
    this.build = this.build.bind(this);
  }

  public build({
    maxSizeInMB = 5,
    dimension,
    allowedTypes,
    fieldName,
  }: ImageUploadValidationBuildProp): (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void> {
    const use = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        await new Promise<void>((resolve, reject) => {
          this._multer.single(fieldName)(req, res, (err) => {
            if (err) {
              reject(err); // If there's an error, reject the promise
            } else {
              resolve(); // Otherwise, resolve the promise
            }
          });
        });

        if (!req.file) {
          res.status(400).json({ error: 'No file uploaded' });
          return;
        }

        if (allowedTypes) {
          if (!allowedTypes.includes(req.file.mimetype)) {
            const allowedTypesString = allowedTypes.join(', ');
            res.status(400).json({
              error: `Invalid file type. Only the following types are allowed: ${allowedTypesString}.`,
            });
            return;
          }
        } else {
          if (!req.file.mimetype.startsWith('image/')) {
            res
              .status(400)
              .json({ error: 'Invalid file type. Only image are allowed' });
            return;
          }
        }

        if (req.file.size > maxSizeInMB * 1024 * 1024) {
          res.status(400).json({ error: `File size exceeds ${maxSizeInMB}MB` });
          return;
        }

        if (dimension) {
          const image = sharp(req.file.buffer);
          const metadata = await image.metadata();
          if (!metadata.width || !metadata.height) {
            res
              .status(400)
              .json({ error: `Could not obtain image dimensions.` });
            return;
          }
          if (
            metadata.width > dimension.width ||
            metadata.height > dimension.height
          ) {
            res.status(400).json({
              error: `Image is too large. It must be ${dimension.width}x${dimension.height} or smaller.`,
            });
            return;
          }
        }

        next();
      } catch (error) {
        const err = error as Error;
        res.status(500).json({
          error: 'An error occurred while processing the image',
          details: err.message,
        });
      }
    };
    return use;
  }
}

export default ImageUploadValidation;
