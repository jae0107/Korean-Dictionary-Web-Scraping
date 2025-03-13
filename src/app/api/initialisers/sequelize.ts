import { Sequelize, Options } from 'sequelize';
import { clsNamespace } from './cls';
import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

export const sequelize: Sequelize = initSequelize();
function initSequelize(): Sequelize {
  Sequelize.useCLS(clsNamespace);
  const sequelize: Sequelize = new Sequelize({
    dialect: process.env.DATABASE_DIALECT,
    dialectModule: pg,
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '', 10),
    pool: {
      max: parseInt(process.env.MAX_DATABASE_CONNECTIONS || '10', 10),
      acquire: 60000,
    },
  } as Options);

  return sequelize;
}
