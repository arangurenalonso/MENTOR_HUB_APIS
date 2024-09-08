import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import streamifier from 'streamifier';
import getVideoDurationInSeconds from 'get-video-duration';
import TYPES from '@config/inversify/identifiers';
import { Multer } from 'multer';

type VideoUploadValidationBuildProp = {
  maxSizeInMB?: number;
  maxDurationInSeconds?: number;
  allowedTypes?: string[];
  fieldName: string;
};

@injectable()
class VideoUploadValidation {
  constructor(@inject(TYPES.Multer) private readonly _multer: Multer) {
    this.build = this.build.bind(this);
  }

  public build({
    maxSizeInMB = 50, // Tamaño máximo en MB
    maxDurationInSeconds = 120, // Duración máxima en segundos (2 minutos)
    allowedTypes, //= ['video/mp4'],
    fieldName,
  }: VideoUploadValidationBuildProp): (
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

        const file = req.file;

        if (!file) {
          res.status(400).json({ error: 'No file uploaded' });
          return;
        }

        // Validar el tipo de archivo
        if (allowedTypes) {
          if (!allowedTypes.includes(file.mimetype)) {
            const allowedTypesString = allowedTypes.join(', ');
            res.status(400).json({
              error: `Invalid file type. Only the following types are allowed: ${allowedTypesString}.`,
            });
            return;
          }
        } else {
          if (!file.mimetype.startsWith('video/')) {
            res
              .status(400)
              .json({ error: 'Invalid file type. Only image are allowed' });
            return;
          }
        }

        // Validar tamaño del archivo
        if (file.size > maxSizeInMB * 1024 * 1024) {
          res
            .status(400)
            .json({ error: `File size exceeds ${maxSizeInMB}MB limit.` });
          return;
        }

        // Usar el método privado para validar la duración del video
        await this.validateAndProcessVideo(file, maxDurationInSeconds);

        // Si todo está bien, continuar con el siguiente middleware
        next();
      } catch (error) {
        const err = error as Error;
        res.status(500).json({
          name: err.name,
          error: 'An error occurred while processing the video',
          details: err.message,
        });
      }
    };
    return use;
  }

  private async validateAndProcessVideo(
    file: Express.Multer.File,
    maxDurationInSeconds: number
  ): Promise<void> {
    try {
      // Convertir el buffer en un stream para pasarlo a getVideoDurationInSeconds
      const stream = streamifier.createReadStream(file.buffer);

      // Obtener la duración del video en segundos
      const durationInSeconds = await getVideoDurationInSeconds(stream);

      // Validar la duración del video
      if (durationInSeconds > maxDurationInSeconds) {
        throw new Error(
          `El video es demasiado largo. Máximo ${maxDurationInSeconds} segundos.`
        );
      }
    } catch (error) {
      const err = error as Error;
      throw new Error('Error al procesar el video: ' + err.message);
    }
  }
}

export default VideoUploadValidation;
