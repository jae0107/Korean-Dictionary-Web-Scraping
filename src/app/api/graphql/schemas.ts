import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDefs } from '../users/typedefs';
import { wordTypeDefs } from "../words/typedefs";

export const typeDefs = mergeTypeDefs([userTypeDefs, wordTypeDefs]);