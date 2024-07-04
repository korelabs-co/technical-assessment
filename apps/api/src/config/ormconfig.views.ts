import { DataSource } from 'typeorm';
require('dotenv/config');

export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.view.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  subscribers: [],
  logging: false,
  ...(JSON.parse(process.env.DB_SSL) && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});
