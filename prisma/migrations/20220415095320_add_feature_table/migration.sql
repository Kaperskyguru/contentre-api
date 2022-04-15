-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "planId" SET DATA TYPE CHAR(36);

-- CreateTable
CREATE TABLE "Feature" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "subscriptionId" CHAR(36) NOT NULL,
    "feature" VARCHAR(120) NOT NULL,
    "value" VARCHAR(36) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
