import DataLoader from "dataloader";
import { Word } from "../models";
import { Op } from "sequelize";
import { groupBy } from "lodash";

export const createWordLoader = () => {
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