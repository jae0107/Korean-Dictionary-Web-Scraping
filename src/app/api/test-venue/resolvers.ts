import { TestVenue } from "../models";
import { Context } from "../graphql/route";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { OffsetPaginationOptions, TestVenueFilterOptions, TestVenueInput } from "@/app/generated/gql/graphql";
import { OffsetPaginationResponse } from "../utils/shared-types";
import { TestVenueSearch } from "./test-venue-search";

export const testVenueResolvers = {
  Query: {
    getTestVenue,
    getTestVenues,
  },
  Mutation: {
    createTestVenue,
    updateTestVenue,
    closeTestVenue,
    restoreTestVenue,
    deleteTestVenue,
  },
};

async function getTestVenue(_: any, { id }: { id: string }, { currentUser }: Context): Promise<TestVenue> {
  return await transaction(async (t) => {
    if (!id) throw new Error('ID is required');
    const testVenue = await TestVenue.findByPk(id);

    if (!testVenue) throw new Error('테스트 장소를 찾을 수 없습니다.');

    return testVenue;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function getTestVenues(
  _: any,
  {
    paginationOptions,
    filterOptions,
  }: { paginationOptions: OffsetPaginationOptions; filterOptions: TestVenueFilterOptions },
  { currentUser }: Context
): Promise<OffsetPaginationResponse<TestVenue>> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const newFilterOptions: TestVenueFilterOptions = currentUser.role === 'STUDENT' ? {
      year: currentUser.year,
      class: currentUser.class,
    } : filterOptions;

    const searcher = new TestVenueSearch({ ...paginationOptions }, { ...newFilterOptions });
    const offsetWordsResponse: OffsetPaginationResponse<TestVenue> = await searcher.process();
    return offsetWordsResponse;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function createTestVenue(
  root: any,
  { input }: { input: TestVenueInput },
  { currentUser }: Context
): Promise<TestVenue> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const newInput = {
      ...input,
      status: 'OPEN',
      year: input.year,
      class: input.class,
      pageFrom: input.pageFrom || undefined,
      pageTo: input.pageTo || undefined,
    };

    const newWord = await TestVenue.create(newInput);

    return newWord;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function updateTestVenue(
  root: any,
  { id, input }: { id: string; input: TestVenueInput },
  { currentUser }: Context
): Promise<TestVenue> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const testVenue = await TestVenue.findByPk(id);

    if (!testVenue) throw new Error('테스트 장소를 찾을 수 없습니다.');

    const newInput = {
      ...input,
      status: 'OPEN',
      year: input.year,
      class: input.class,
      pageFrom: input.pageFrom || undefined,
      pageTo: input.pageTo || undefined,
    };

    const newWord = await testVenue.update(newInput);

    return newWord;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function closeTestVenue(
  root: any,
  { id }: { id: string; },
  { currentUser }: Context
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const testVenue = await TestVenue.findByPk(id);

    if (!testVenue) throw new Error('테스트 장소를 찾을 수 없습니다.');

    await testVenue.update({ status: 'CLOSED' });

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function restoreTestVenue(
  root: any,
  { id }: { id: string; },
  { currentUser }: Context
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const testVenue = await TestVenue.findByPk(id);

    if (!testVenue) throw new Error('테스트 장소를 찾을 수 없습니다.');

    await testVenue.update({ status: 'OPEN' });

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}

async function deleteTestVenue(
  root: any,
  { id }: { id: string; },
  { currentUser }: Context
): Promise<boolean> {
  return await transaction(async (t) => {
    if (!currentUser) throw new Error('No Current User Found');

    const testVenue = await TestVenue.findByPk(id);

    if (!testVenue) throw new Error('테스트 장소를 찾을 수 없습니다.');

    await testVenue.destroy();

    return true;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}