-- CreateEnum
CREATE TYPE "SignedUpThrough" AS ENUM ('CONTENTRE', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "signedUpThrough" "SignedUpThrough" NOT NULL DEFAULT E'CONTENTRE';
