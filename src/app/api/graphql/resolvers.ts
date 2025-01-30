import { merge } from 'lodash';
import { userResolvers } from '../users/resolvers';
import { wordResolvers } from '../words/resolvers';

export const resolvers = merge(
  userResolvers,
  wordResolvers
);
