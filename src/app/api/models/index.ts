import { PasswordResetRequest } from "./password-reset-requests";
import { User } from "./user";
import { Word } from "./word";

const models = {
  User,
  Word,
  PasswordResetRequest,
};

Object.values(models).forEach((model) => {
  model.associate(models);
});

export {
  User,
  Word,
  PasswordResetRequest,
};
