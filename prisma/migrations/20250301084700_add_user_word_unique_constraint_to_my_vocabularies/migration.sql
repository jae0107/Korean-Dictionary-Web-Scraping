/*
  Warnings:

  - A unique constraint covering the columns `[userId,wordId]` on the table `myVocabularies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "myVocabularies_userId_wordId_key" ON "myVocabularies"("userId", "wordId");
