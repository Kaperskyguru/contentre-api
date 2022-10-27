/*
  Warnings:

  - You are about to alter the column `title` on the `Template` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2048)` to `VarChar(36)`.
  - You are about to alter the column `slug` on the `Template` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2048)` to `VarChar(120)`.

*/
-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "googleAnalyticId" CHAR(36);

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "demoLink" VARCHAR(2048),
ADD COLUMN     "image" VARCHAR(2048),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(120);
