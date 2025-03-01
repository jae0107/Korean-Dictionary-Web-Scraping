/*
  Warnings:

  - The primary key for the `myVocabularies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `myVocabularies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `passwordResetRequests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `passwordResetRequests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `words` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `words` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `wordId` on the `myVocabularies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "myVocabularies" DROP CONSTRAINT "myVocabularies_wordId_fkey";

-- AlterTable
ALTER TABLE "myVocabularies" DROP CONSTRAINT "myVocabularies_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "wordId",
ADD COLUMN     "wordId" UUID NOT NULL,
ADD CONSTRAINT "myVocabularies_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "passwordResetRequests" DROP CONSTRAINT "passwordResetRequests_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "passwordResetRequests_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "words" DROP CONSTRAINT "words_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "words_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "myVocabularies_userId_wordId_key" ON "myVocabularies"("userId", "wordId");

-- AddForeignKey
ALTER TABLE "myVocabularies" ADD CONSTRAINT "myVocabularies_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
