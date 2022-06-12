/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `Feature` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentChannel" AS ENUM ('PAYSTACK', 'STRIPE');

-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Feature" DROP COLUMN "subscriptionId",
ADD COLUMN     "planId" CHAR(36);

-- CreateTable
CREATE TABLE "Plan" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "channel" "PaymentChannel" NOT NULL DEFAULT E'PAYSTACK',
    "paymentPlanId" CHAR(36),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
