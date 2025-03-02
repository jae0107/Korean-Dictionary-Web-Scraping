/*
  Warnings:

  - You are about to drop the column `requestorId` on the `words` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "words" DROP CONSTRAINT "words_requestorId_fkey";

-- AlterTable
ALTER TABLE "words" DROP COLUMN "requestorId",
ADD COLUMN     "requestorIds" TEXT[];
