import { DataSource } from 'typeorm';
import { inject, injectable } from 'inversify';
import Environment from '@config/enviroment';
import TYPES from '@config/inversify/identifiers';

@injectable()
class TypeORMInitializer {
  private _appDataSource?: DataSource;

  constructor(
    @inject(TYPES.Environment)
    private readonly _envs: Environment
  ) {}

  initialize(): Promise<any> {
    const appDataSource = new DataSource({
      type: 'postgres',
      host: this._envs.dbHost,
      port: this._envs.dbPort,
      username: this._envs.dbUserName,
      password: this._envs.dbPassword,
      database: this._envs.dbName,
      synchronize: this._envs.dbSincronize,
      logging: this._envs.dbLogging,
      entities: this._envs.dbEntities,
      // migrationsTableName: 'migration_table',
      // migrations: ['src/infrastructure/persistence/migration/**/*.ts'],
    });
    this._appDataSource = appDataSource;
    return this._appDataSource
      .initialize()
      .then(() => {
        console.log('Database initialized');
      })
      .catch((error) => {
        console.error('Database Error: ', error);
      });
  }
  close(): void {
    this._appDataSource?.destroy();
  }
  get dataSource(): DataSource {
    if (!this._appDataSource) {
      throw new Error('Database not initialized');
    }
    return this._appDataSource;
  }
}
export default TypeORMInitializer;
