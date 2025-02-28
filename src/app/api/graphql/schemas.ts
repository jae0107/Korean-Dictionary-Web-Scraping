import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDefs } from '../users/typedefs';
import { wordTypeDefs } from "../words/typedefs";
import { passwordResetRequestTypeDefs } from "../password-reset-requests/typedefs";

export const typeDefs = mergeTypeDefs([userTypeDefs, wordTypeDefs, passwordResetRequestTypeDefs]);