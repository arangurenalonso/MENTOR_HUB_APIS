import { config } from 'dotenv';
import path from 'path';

import * as env from 'env-var';
import { injectable } from 'inversify';

@injectable()
class Environment {
  public readonly port: number;
  public readonly publicPath: string;
  public readonly dbPort: number;
  public readonly dbUserName: string;
  public readonly dbPassword: string;
  public readonly dbName: string;
  public readonly dbEntities: string[];
  public readonly dbSincronize: boolean;
  public readonly dbLogging: boolean;
  public readonly dbHost: string;
  public readonly saltRounds: number = 10;
  public readonly jwtSecret: string;
  public readonly jwtExpireRefreshToken: string = '7d';
  public readonly jwtExpireAccessToken: string = '1h';
  public readonly mailerEmail: string;
  public readonly mailerSecretKey: string;
  public readonly mailerService: string;
  public readonly webserviceUrl: string;

  // Nuevas variables de entorno para AWS S3
  public readonly awsAccessKeyId: string;
  public readonly awsSecretAccessKey: string;
  public readonly awsRegion: string;
  public readonly awsS3BucketName: string;

  constructor() {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);
    config({ path: envPath });

    this.port = env.get('PORT').required().asPortNumber();
    this.publicPath = env.get('PUBLIC_PATH').default('public').asString();
    this.dbUserName = env.get('POSTGRES_DB_USER').required().asString();
    this.dbPassword = env.get('POSTGRES_DB_PASSWORD').required().asString();
    this.dbName = env.get('POSTGRES_DB_DATABASE').required().asString();
    this.dbPort = env.get('POSTGRES_DB_PORT').required().asPortNumber();
    this.dbHost = env.get('POSTGRES_DB_HOST').required().asString();
    this.dbLogging = env.get('POSTGRES_DB_LOGGING').required().asBool();
    this.dbSincronize = env.get('POSTGRES_DB_SINCRONIZE').required().asBool();
    this.dbEntities = env.get('DB_ENTITIES').required().asString().split(',');
    this.saltRounds = env.get('SALT_ROUNDS').required().asIntPositive();
    this.jwtSecret = env.get('JWT_SECRET').required().asString();
    this.jwtExpireAccessToken = env
      .get('JWT_EXPIRE_ACCESS_TOKEN')
      .required()
      .asString();

    this.jwtExpireRefreshToken = env
      .get('JWT_EXPIRE_REFRESH_TOKEN')
      .required()
      .asString();

    this.mailerEmail = env.get('MAILER_EMAIL').required().asEmailString();
    this.mailerSecretKey = env.get('MAILER_SECRET_KEY').required().asString();
    this.mailerService = env.get('MAILER_SERVICE').required().asString();
    this.webserviceUrl = env.get('WEBSERVICE_URL').required().asString();

    // Inicialización de las variables de entorno para AWS S3
    this.awsAccessKeyId = env.get('AWS_ACCESS_KEY_ID').required().asString();
    this.awsSecretAccessKey = env
      .get('AWS_SECRET_ACCESS_KEY')
      .required()
      .asString();
    this.awsRegion = env.get('AWS_REGION').required().asString();
    this.awsS3BucketName = env.get('AWS_S3_BUCKET_NAME').required().asString();
  }
}
export default Environment;
