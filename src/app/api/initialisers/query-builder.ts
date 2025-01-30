import { Knex } from 'knex';
import { knex } from './knex';

export type QueryBuilder = Knex.QueryBuilder;

export const queryBuilder = (tableName: string) => knex(tableName);
