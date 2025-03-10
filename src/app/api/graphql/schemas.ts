import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDefs } from '../users/typedefs';
import { wordTypeDefs } from "../words/typedefs";
import { passwordResetRequestTypeDefs } from "../password-reset-requests/typedefs";
import { myVocabularyTypeDefs } from "../my-vocabularies/typedefs";
import { miniTestTypeDefs } from "../mini-test/typedefs";
import { testVenueTypeDefs } from "../test-venue/typedefs";
import { testResultTypeDefs } from "../test-result/typedefs";

export const typeDefs = mergeTypeDefs([
  userTypeDefs, 
  wordTypeDefs, 
  passwordResetRequestTypeDefs, 
  myVocabularyTypeDefs,
  miniTestTypeDefs,
  testVenueTypeDefs,
  testResultTypeDefs,
]);