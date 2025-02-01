-- DropForeignKey
ALTER TABLE "words" DROP CONSTRAINT "words_requestorId_fkey";

-- AlterTable
ALTER TABLE "words" ALTER COLUMN "requestorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
