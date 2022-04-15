-- AlterTable
ALTER TABLE "User" ADD COLUMN     "billingId" CHAR(36),
ADD COLUMN     "hasTrial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscriptionId" CHAR(36),
ADD COLUMN     "trialEndDate" TIMESTAMP(6);
