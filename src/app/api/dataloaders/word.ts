import DataLoader from "dataloader";
import { Word } from "../models";
import { Op } from "sequelize";
import { groupBy } from "lodash";

export const createWordLoaderByRequestorId = () => {
  return new DataLoader(async (keys: readonly string[]) => {
    const words = await Word.findAll({
      where: {
        requestorId: { [Op.in]: keys },
      },
    });
    
    const wordGroups = groupBy(words, 'requestorId');
    return keys.map((key) => wordGroups[key] ?? []);
  });
}
export const createWordLoaderById = () => {
  return new DataLoader(async (keys: readonly string[]) => {
    const words = await Word.findAll({
      where: { id: { [Op.in]: keys } },
    });
    
    const wordMap = new Map(
      words.map((word) => [word.get('id'), word]),
    );
    return keys.map((key) => wordMap.get(key));
  });
}