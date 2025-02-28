import { merge } from 'lodash';
import { userResolvers } from '../users/resolvers';
import { wordResolvers } from '../words/resolvers';
import { passwordResetRequestResolvers } from '../password-reset-requests/resolvers';

export const resolvers = merge(
  userResolvers,
  wordResolvers,
  passwordResetRequestResolvers,
);
