import { TestResultInput } from "@/app/generated/gql/graphql";
import { TestResult, TestVenue, User } from "../models";
import { Context } from "../graphql/route";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";

export const testResultResolvers = {
  Mutation: {
    createTestResult,
  },
  TestResult: {
    async user(testResult: TestResult, _: any) {
      return await User.findByPk(testResult.userId);
    },
    async testVenue(testResult: TestResult, _: any) {
      return await TestVenue.findByPk(testResult.testVenueId);
    },
  }
};

async function createTestResult(
  root: any,
  { input }: { input: TestResultInput },
  { currentUser }: Context
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const existingTestResult = await TestResult.findOne({
      where: {
        userId: currentUser.id,
        testVenueId: input.testVenueId,
      }
    });

    if (existingTestResult) {
      throw new Error('이미 시험 결과가 존재합니다.');
    }

    const newInput = {
      ...input,
      userId: currentUser.id,
    };

    await TestResult.create(newInput);

    return true;
  }).catch((e) => {
    console.log("Error: ", e);
    throw new ApolloResponseError(e);
  });
}