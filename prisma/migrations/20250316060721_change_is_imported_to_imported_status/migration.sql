/*
  Warnings:

  - You are about to drop the column `isImported` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isImported",
ADD COLUMN     "importedStatus" TEXT NOT NULL DEFAULT 'NOT_IMPORTED';
