/*
  Warnings:

  - You are about to drop the column `page` on the `words` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "words" DROP COLUMN "page",
ADD COLUMN     "pages" INTEGER[];
