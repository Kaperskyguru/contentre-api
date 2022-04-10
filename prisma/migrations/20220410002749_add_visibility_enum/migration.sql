/*
  Warnings:

  - The `visibility` column on the `Content` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `visibility` column on the `Template` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'TEAM', 'UNLISTED');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('PUBLISHED', 'DRAFT', 'DELETED');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT E'PUBLIC';

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "status" "StatusType" NOT NULL DEFAULT E'PUBLISHED',
DROP COLUMN "visibility",
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT E'PUBLIC';

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT E'PRIVATE';

-- DropEnum
DROP TYPE "TemplateVisility";

-- DropEnum
DROP TYPE "VisibilityType";
