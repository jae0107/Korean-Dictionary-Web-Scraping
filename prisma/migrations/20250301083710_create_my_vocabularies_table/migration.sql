-- CreateTable
CREATE TABLE "myVocabularies" (
    "id" TEXT NOT NULL,
    "userId" UUID,
    "wordId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "myVocabularies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "myVocabularies" ADD CONSTRAINT "myVocabularies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "myVocabularies" ADD CONSTRAINT "myVocabularies_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
