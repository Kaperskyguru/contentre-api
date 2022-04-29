-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- DropIndex
DROP INDEX "Content_clientId_userId_idx";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "teamId" CHAR(36);

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "teamId" CHAR(36);

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "teamId" CHAR(36);

-- AlterTable
ALTER TABLE "Social" ADD COLUMN     "teamId" CHAR(36);

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "teamId" CHAR(36);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeTeamId" CHAR(36);

-- CreateTable
CREATE TABLE "Team" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "address" VARCHAR(2048),
    "portfolio" VARCHAR(2048),
    "avatarURL" VARCHAR(2048),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionId" CHAR(36),
    "billingId" CHAR(36),
    "hasTrial" BOOLEAN NOT NULL DEFAULT false,
    "trialEndDate" TIMESTAMP(6),

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "userId" CHAR(36) NOT NULL,
    "teamId" CHAR(36) NOT NULL,
    "role" "MemberRole" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("userId","teamId")
);

-- CreateIndex
CREATE INDEX "Content_clientId_userId_teamId_idx" ON "Content"("clientId", "userId", "teamId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_activeTeamId_fkey" FOREIGN KEY ("id", "activeTeamId") REFERENCES "Member"("userId", "teamId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
