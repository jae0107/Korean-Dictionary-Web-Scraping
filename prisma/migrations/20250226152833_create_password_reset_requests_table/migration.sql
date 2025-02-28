-- CreateTable
CREATE TABLE "passwordResetRequests" (
    "id" TEXT NOT NULL,
    "requestorId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passwordResetRequests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "passwordResetRequests" ADD CONSTRAINT "passwordResetRequests_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
