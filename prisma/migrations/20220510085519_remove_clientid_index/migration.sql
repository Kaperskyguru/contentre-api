-- DropIndex
DROP INDEX "Content_clientId_userId_teamId_idx";

-- CreateIndex
CREATE INDEX "Content_userId_teamId_idx" ON "Content"("userId", "teamId");
