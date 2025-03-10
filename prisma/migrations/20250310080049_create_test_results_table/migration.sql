-- CreateTable
CREATE TABLE "testResults" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "testVenueId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testResults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "testResults_userId_testVenueId_key" ON "testResults"("userId", "testVenueId");

-- AddForeignKey
ALTER TABLE "testResults" ADD CONSTRAINT "testResults_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testResults" ADD CONSTRAINT "testResults_testVenueId_fkey" FOREIGN KEY ("testVenueId") REFERENCES "testVenues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
