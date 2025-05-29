import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  synchronize: false,
  database: process.env.DB_NAME || 'inventory',
  entities: [`${__dirname}/../**/entities/*.{ts,js}`],
  migrations: [`${__dirname}/../**/migrations/**/*{.ts,.js}`],
};
