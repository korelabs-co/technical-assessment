import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
require('dotenv').config({ path: './.env' });

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/../**/*.{entity,view}.{js,ts}'],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      subscribers: [],
      synchronize: JSON.parse(process.env.DB_SYNC),
      logging: true,
      ...(JSON.parse(process.env.DB_SSL) && {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      extra: {
        connectionLimit: 30,
        max: 30,
      },
    };
  },
};

export const typeOrmConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  subscribers: [],
  synchronize: JSON.parse(process.env.DB_SYNC ?? 'false'),
  logging: true,
  ...(JSON.parse(process.env.DB_SSL ?? 'false') && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});
