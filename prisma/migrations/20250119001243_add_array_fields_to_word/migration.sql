/*
  Warnings:

  - The `korDicResults` column on the `words` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `naverDicResults` column on the `words` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "words" DROP COLUMN "korDicResults",
ADD COLUMN     "korDicResults" TEXT[],
DROP COLUMN "naverDicResults",
ADD COLUMN     "naverDicResults" TEXT[];
