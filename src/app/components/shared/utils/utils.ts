import { WordInput } from "@/app/generated/gql/graphql";

const normalise = (str: string) => str.replace(/\s+/g, '').replace(/[.,!?]/g, '');

export const checkDuplicate = (existingWord: WordInput, newWord: WordInput) => {
  const errors: string[] = [];
  if (existingWord.korDicResults && existingWord.korDicResults.length > 0 && newWord.korDicResults && newWord.korDicResults.length > 0) {
    const hasDuplicate = existingWord.korDicResults.some((result) =>
      (newWord.korDicResults ?? []).some((newResult) => normalise(result) === normalise(newResult))
    );
    hasDuplicate && errors.push('국립국어원 결과가 중복됩니다.');
  }
  if (existingWord.naverDicResults && existingWord.naverDicResults.length > 0 && newWord.naverDicResults && newWord.naverDicResults.length > 0) {
    const hasDuplicate = existingWord.naverDicResults.some((result) =>
      (newWord.naverDicResults ?? []).some((newResult) => normalise(result) === normalise(newResult))
    );
    hasDuplicate && errors.push('네이버 결과가 중복됩니다.');
  }
  if (existingWord.pages && existingWord.pages.length > 0 && newWord.pages && newWord.pages.length > 0) {
    const hasDuplicate = existingWord.pages.some((result) =>
      (newWord.pages ?? []).includes(result)
    );
    hasDuplicate && errors.push('페이지가 중복됩니다.');
  }
  if (existingWord.examples && existingWord.examples.length > 0 && newWord.examples && newWord.examples.length > 0) {
    const hasDuplicate = existingWord.examples.some((result) =>
      (newWord.examples ?? []).some((newResult) => normalise(result) === normalise(newResult))
    );
    hasDuplicate && errors.push('예문이 중복됩니다.');
  }
  
  if (newWord.examples?.length === 0 && newWord.korDicResults?.length === 0 && newWord.naverDicResults?.length === 0 && newWord.pages?.length === 0) {
    errors.push('새로운 입력값이 없습니다.');
  }
  return errors;
}