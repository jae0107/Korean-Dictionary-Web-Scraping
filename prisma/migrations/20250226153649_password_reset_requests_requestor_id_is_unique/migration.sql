/*
  Warnings:

  - A unique constraint covering the columns `[requestorId]` on the table `passwordResetRequests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "passwordResetRequests_requestorId_key" ON "passwordResetRequests"("requestorId");
