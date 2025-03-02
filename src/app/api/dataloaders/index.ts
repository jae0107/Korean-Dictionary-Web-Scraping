import { createMyVocabularyLoader } from "./my-vocabulary";
import { createUserLoader } from "./user";
import { createWordLoaderById } from "./word";

export const createDataLoaders = () => ({
  wordById: createWordLoaderById(),
  user: createUserLoader(),
  myVocabulary: createMyVocabularyLoader(),
});