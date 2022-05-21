/*
  Warnings:

  - You are about to drop the column `slug` on the `UserTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `UserTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserTemplate" DROP COLUMN "slug",
DROP COLUMN "type";
