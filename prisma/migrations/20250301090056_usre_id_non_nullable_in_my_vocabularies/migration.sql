/*
  Warnings:

  - Made the column `userId` on table `myVocabularies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "myVocabularies" DROP CONSTRAINT "myVocabularies_userId_fkey";

-- AlterTable
ALTER TABLE "myVocabularies" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "myVocabularies" ADD CONSTRAINT "myVocabularies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
