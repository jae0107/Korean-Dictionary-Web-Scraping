import { createMyVocabCountLoaderByRequestor, createMyVocabularyLoader } from "./my-vocabulary";
import { createTestResultLoader, createUserLoader } from "./user";
import { createApprovedCountLoaderByRequestor, createWordLoaderById } from "./word";

export const createDataLoaders = () => ({
  wordById: createWordLoaderById(),
  user: createUserLoader(),
  myVocabulary: createMyVocabularyLoader(),
  approvedCountByRequestor: createApprovedCountLoaderByRequestor(),
  myVocabCount: createMyVocabCountLoaderByRequestor(),
  testResult: createTestResultLoader(),
});