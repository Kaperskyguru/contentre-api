-- CreateEnum
CREATE TYPE "TwoFactorType" AS ENUM ('EMAIL', 'SMS', 'NONE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referrerId" CHAR(36),
ADD COLUMN     "twofactor" "TwoFactorType" NOT NULL DEFAULT E'NONE';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
