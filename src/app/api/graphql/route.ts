import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { createDataLoaders } from "../dataloaders";
import { User } from "../models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
  currentUser?: User;
  dataloaders: ReturnType<typeof createDataLoaders>;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== "production", // Disable in production
});

export const runtime = 'nodejs';

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(authOptions);

    const dataloaders = createDataLoaders();

    if (session && session.user && session.user.id) {
      const currentUser = await User.findByPk(session.user.id);
      if (currentUser) {
        return {
          req,
          res,
          currentUser,
          dataloaders,
        }
      }
    }
    
    const context: Context = {
      req,
      res,
      dataloaders,
    };
    return context;
  },
});

export { handler as GET, handler as POST };