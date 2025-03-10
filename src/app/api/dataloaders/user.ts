import DataLoader from "dataloader";
import { User } from "../models";
import { Op, QueryTypes } from "sequelize";
import { queryBuilder, QueryBuilder, sequelize } from "../initialisers";
import { UserTestResult } from "@/app/generated/gql/graphql";

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

export const createTestResultLoader = () => {
  return new DataLoader(async (keys: readonly string[]) => {
    let query: QueryBuilder = queryBuilder('testResults');

    query = query
      .select('testResults.testScore', 'testVenues.title', 'testResults.userId')
      .leftJoin('testVenues', 'testResults.testVenueId', 'testVenues.id')
      .whereIn('testResults.userId', keys);

    const results = await sequelize.query(query.toString(), { type: QueryTypes.SELECT }) as { 
      title: string; 
      testScore: number; 
      userId: string; 
    }[];

    const resultMap = new Map<string, UserTestResult[]>();

    results.forEach((result) => {
      if (!resultMap.has(result.userId)) {
        resultMap.set(result.userId, []);
      }
      resultMap.get(result.userId)!.push({ title: result.title, testScore: result.testScore } as UserTestResult);
    });

    return keys.map((key) => resultMap.get(key) || []);
  });
};
