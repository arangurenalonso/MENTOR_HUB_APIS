// src/infrastructure/repositories/S3Repository.ts
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import IS3Service from '@application/contracts/IS3.service';
import Environment from '@config/enviroment';
import TYPES from '@config/inversify/identifiers';
import { inject, injectable } from 'inversify';

@injectable()
class S3Service implements IS3Service {
  private _s3Client: S3Client;
  private _bucketName: string;

  constructor(@inject(TYPES.Environment) private readonly _env: Environment) {
    this._s3Client = new S3Client({
      credentials: {
        accessKeyId: _env.awsAccessKeyId,
        secretAccessKey: _env.awsSecretAccessKey,
      },
      region: _env.awsRegion,
    });
    this._bucketName = _env.awsS3BucketName;
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this._bucketName,
      Key: key,
    };
    await this._s3Client.send(new DeleteObjectCommand(params));
  }

  async checkFileExists(key: string): Promise<boolean> {
    const params = {
      Bucket: this._bucketName,
      Key: key,
    };

    try {
      // Intentamos verificar si el archivo existe en el bucket S3
      await this._s3Client.send(new HeadObjectCommand(params));
      return true;
    } catch (error: any) {
      return false;
      // switch (error.name) {
      //   case 'NotFound':
      //     throw new Error(
      //       `El archivo con la clave ${key} no existe en el bucket.`
      //     );
      //   case 'NoSuchKey':
      //     throw new Error(`El archivo con la clave "${key}" no existe.`);
      //   case 'AccessDenied':
      //     throw new Error(
      //       `No tienes permisos para acceder al archivo "${key}".`
      //     );
      //   case 'ServiceUnavailable':
      //     throw new Error(
      //       `El servicio S3 no está disponible en este momento. Intenta más tarde.`
      //     );
      //   default:
      //     throw new Error(
      //       `Error inesperado al verificar el archivo: ${error.message}`
      //     );
      // }
    }
  }
  async getFileUrl(key: string): Promise<string | null> {
    const resultCheckFileExists = await this.checkFileExists(key);
    if (!resultCheckFileExists) {
      return null;
    }
    const params = {
      Bucket: this._bucketName,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    return getSignedUrl(this._s3Client, command, { expiresIn: 60 * 60 * 3 }); // Use getSignedUrl here
  }

  async uploadFile(
    key: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<string> {
    const params = {
      Bucket: this._bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    };

    await this._s3Client.send(new PutObjectCommand(params));
    return (await this.getFileUrl(key)) || '';
  }
}
export default S3Service;
