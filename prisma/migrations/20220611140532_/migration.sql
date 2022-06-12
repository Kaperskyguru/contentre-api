/*
  Warnings:

  - You are about to drop the column `channel` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `paymentPlanId` on the `Plan` table. All the data in the column will be lost.
  - The `channel` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentChannelType" AS ENUM ('PAYSTACK', 'STRIPE');

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "channel",
DROP COLUMN "paymentPlanId";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "paymentChannelId" CHAR(36),
DROP COLUMN "channel",
ADD COLUMN     "channel" "PaymentChannelType";

-- DropEnum
DROP TYPE "PaymentChannel";

-- CreateTable
CREATE TABLE "PaymentChannel" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "channel" "PaymentChannelType" NOT NULL DEFAULT E'PAYSTACK',
    "planId" CHAR(36) NOT NULL,
    "paymentPlanId" CHAR(36),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentChannel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_paymentChannelId_fkey" FOREIGN KEY ("paymentChannelId") REFERENCES "PaymentChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentChannel" ADD CONSTRAINT "PaymentChannel_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
