/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[activeSubscriptionId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subscriptionId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeSubscriptionId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "teamId" CHAR(36),
ADD COLUMN     "userId" CHAR(36);

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "subscriptionId",
ADD COLUMN     "activeSubscriptionId" CHAR(36);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeSubscriptionId" CHAR(36);

-- CreateIndex
CREATE UNIQUE INDEX "Team_activeSubscriptionId_key" ON "Team"("activeSubscriptionId");

-- CreateIndex
-- CREATE UNIQUE INDEX "User_subscriptionId_key" ON "User"("subscriptionId");

-- CreateIndex
-- CREATE UNIQUE INDEX "User_activeSubscriptionId_key" ON "User"("activeSubscriptionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeSubscriptionId_fkey" FOREIGN KEY ("activeSubscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_activeSubscriptionId_fkey" FOREIGN KEY ("activeSubscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
