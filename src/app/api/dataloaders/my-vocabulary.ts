import DataLoader from "dataloader";
import { MyVocabulary } from "../models";
import { Op } from "sequelize";

export const createMyVocabularyLoader = () => {
  return new DataLoader(async (keys: readonly { userId: string, wordId: string }[]) => {
    const userIds = keys.map((key) => key.userId);
    const wordIds = keys.map((key) => key.wordId);

    const myVocabularies = await MyVocabulary.findAll({
      where: { 
        userId: { [Op.in]: userIds },
        wordId: { [Op.in]: wordIds }
      },
    });
    
    const userMap = new Map(
      myVocabularies.map((myVocabulary) => [myVocabulary.get('wordId'), myVocabulary]),
    );
    return keys.map((key) => userMap.get(key.wordId));
  });
}