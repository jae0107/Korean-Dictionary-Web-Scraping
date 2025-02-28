import { UserInput } from "../generated/gql/graphql";

export interface RawJsonDataProps {
  id: number;
  name: string;
  year: number;
  class: number;
  number: number;
  accountId?: string;
  password?: string;
}

export interface JsonDataProps {
  id: number;
  name: string;
  year: number;
  class: number;
  number: number;
  accountId: string;
  password: string;
  role: string;
  isDuplicate: boolean;
}

export interface ExtendedUserInput extends UserInput {
  id: number;
}