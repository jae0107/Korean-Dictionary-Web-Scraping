import { MiniTest, MiniTestFilterOptions } from "@/app/generated/gql/graphql";
import { Context } from "../graphql/route";
import { transaction } from "../utils/transaction-helpers";
import { ApolloResponseError } from "../utils/error-handler";
import { knex, queryBuilder, QueryBuilder, sequelize } from "../initialisers";
import { QueryTypes } from "sequelize";
import { isPresent } from "../utils/object-helpers";

export const miniTestResolvers = {
  Query: {
    getMiniTests,
  },
};

async function getMiniTests(
  _: any,
  { filterOptions } : { filterOptions: MiniTestFilterOptions },{ currentUser }: Context
): Promise<MiniTest[]> {
  return await transaction(async (t) => {
    const { pageFrom, pageTo } = filterOptions;

    let query: QueryBuilder = queryBuilder('words');

    const baseRandomTitles = knex('words')
      .select('title', 'pages')
      .where('status', 'APPROVED')
      .orderByRaw('RANDOM()')
      .limit(20);

    if (isPresent(pageFrom) && isPresent(pageTo) && pageFrom !== 0 && pageTo !== 0) {
      baseRandomTitles.whereRaw(
        'EXISTS (SELECT 1 FROM unnest(pages) AS page WHERE page BETWEEN ? AND ?)',
        [pageFrom, pageTo]
      );
    }

    const baseSelectedWords = knex('words')
      .select('id', 'title AS correctAnswer', 'korDicResults', 'naverDicResults')
      .select(
        knex.raw(`
          ARRAY(
            SELECT title_element FROM jsonb_array_elements_text(
              jsonb_build_array(words.title) || 
              (SELECT jsonb_agg(title) FROM (
                SELECT title FROM words AS w 
                WHERE w.title != words.title 
                ORDER BY RANDOM() 
                LIMIT 3
              ) AS random_titles)
            ) AS title_element
            ORDER BY RANDOM()
          ) AS options
        `)
      )
      .where('status', 'APPROVED');

    if (isPresent(pageFrom) && isPresent(pageTo) && pageFrom !== 0 && pageTo !== 0) {
      baseSelectedWords.whereRaw(
        'EXISTS (SELECT 1 FROM unnest(words.pages) AS page WHERE page BETWEEN ? AND ?)',
        [pageFrom, pageTo]
      );
    }

    query = query
      .with('random_titles', baseRandomTitles)
      .with('selected_words', baseSelectedWords)
      .select('*')
      .from('selected_words')
      .orderByRaw('RANDOM()')
      .limit(10);


    const results = (await sequelize.query(query.toString(), { type: QueryTypes.SELECT })) as MiniTest[];

    return results;
  }).catch((e) => {
    throw new ApolloResponseError(e);
  });
}