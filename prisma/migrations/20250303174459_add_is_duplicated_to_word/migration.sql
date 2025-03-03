-- AlterTable
ALTER TABLE "words" ADD COLUMN     "isDuplicated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wordId" UUID;
