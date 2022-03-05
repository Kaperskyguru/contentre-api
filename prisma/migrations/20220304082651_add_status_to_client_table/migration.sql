-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "status" "Status" NOT NULL DEFAULT E'ACTIVE';

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "bookmark" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "favourite" BOOLEAN NOT NULL DEFAULT false;
