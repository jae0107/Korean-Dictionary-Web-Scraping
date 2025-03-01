import { createMyVocabularyLoader } from "./my-vocabulary";
import { createUserLoader } from "./user";
import { createWordLoader } from "./word";

export const createDataLoaders = () => ({
  word: createWordLoader(),
  user: createUserLoader(),
  myVocabulary: createMyVocabularyLoader(),
});