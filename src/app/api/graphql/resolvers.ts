import { merge } from 'lodash';
import { userResolvers } from '../users/resolvers';
import { wordResolvers } from '../words/resolvers';
import { passwordResetRequestResolvers } from '../password-reset-requests/resolvers';
import { myVocabularyResolvers } from '../my-vocabularies/resolvers';
import { miniTestResolvers } from '../mini-test/resolvers';
import { testVenueResolvers } from '../test-venue/resolvers';
import { testResultResolvers } from '../test-result/resolver';

export const resolvers = merge(
  userResolvers,
  wordResolvers,
  passwordResetRequestResolvers,
  myVocabularyResolvers,
  miniTestResolvers,
  testVenueResolvers,
  testResultResolvers,
);
