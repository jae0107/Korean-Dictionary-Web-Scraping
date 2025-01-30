import { GraphQLError } from 'graphql';

export class ApolloResponseError extends GraphQLError {
  constructor(e: Error, code?: string, extensions?: { [key: string]: string }) {
    super(e.message, {
      extensions: {
        ...extensions,
        ...e,
        code: code || 'BAD_REQUEST',
      },
    });

    Object.defineProperty(this, 'name', { value: 'ApolloResponseError' });
  }
}
