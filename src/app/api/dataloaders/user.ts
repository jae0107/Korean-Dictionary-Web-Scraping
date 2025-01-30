import DataLoader from "dataloader";
import { User } from "../models";
import { Op } from "sequelize";

export const createUserLoader = () => {
  return new DataLoader(async (keys: readonly string[]) => {
    const users = await User.findAll({
      where: { id: { [Op.in]: keys } },
    });
    
    const userMap = new Map(
      users.map((user) => [user.get('id'), user]),
    );
    return keys.map((key) => userMap.get(key));
  });
}