-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ARTICLE', 'MONTHLY', 'ONETIME');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "color" CHAR(6);

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT E'ARTICLE';

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "comments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT E'ARTICLE',
ADD COLUMN     "shares" INTEGER NOT NULL DEFAULT 0;
