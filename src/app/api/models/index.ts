import { MyVocabulary } from "./my-vocabulary";
import { PasswordResetRequest } from "./password-reset-requests";
import { TestResult } from "./test-result";
import { TestVenue } from "./test-venue";
import { User } from "./user";
import { Word } from "./word";

const models = {
  User,
  Word,
  PasswordResetRequest,
  MyVocabulary,
  TestVenue,
  TestResult,
};

Object.values(models).forEach((model) => {
  model.associate(models);
});

export {
  User,
  Word,
  PasswordResetRequest,
  MyVocabulary,
  TestVenue,
  TestResult,
};
