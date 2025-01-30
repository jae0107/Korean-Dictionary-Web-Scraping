import { User } from "./user";
import { Word } from "./word";

const models = {
  User,
  Word,
};

Object.values(models).forEach((model) => {
  model.associate(models);
});

export {
  User,
  Word,
};
