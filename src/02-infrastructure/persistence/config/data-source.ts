import { DataSource } from 'typeorm';
export const AppDataSource = new DataSource({
  type: 'postgres', // Change this to 'mysql', 'mariadb', 'sqlite', etc., as needed
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'mysecretpassword',
  database: 'MENTOR_HUB',
  synchronize: false, // Set to false for production
  logging: true,
  entities: ['src/**/*.entity.ts'],
  // migrations: ['src/infrastructure/persistence/migration/*.ts'],
  subscribers: [], // If you use subscribers, add their paths here
});
