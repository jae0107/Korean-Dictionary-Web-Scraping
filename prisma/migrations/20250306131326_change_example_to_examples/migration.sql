/*
  Warnings:

  - You are about to drop the column `example` on the `words` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "words" DROP COLUMN "example",
ADD COLUMN     "examples" TEXT[];
