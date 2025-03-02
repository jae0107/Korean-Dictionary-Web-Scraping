import { createMyVocabularyLoader } from "./my-vocabulary";
import { createUserLoader } from "./user";
import { createWordLoaderById, createWordLoaderByRequestorId } from "./word";

export const createDataLoaders = () => ({
  wordByRequestorId: createWordLoaderByRequestorId(),
  wordById: createWordLoaderById(),
  user: createUserLoader(),
  myVocabulary: createMyVocabularyLoader(),
});