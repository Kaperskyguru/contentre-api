/*
  Warnings:

  - You are about to drop the column `analyticsId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "analyticsId",
ALTER COLUMN "umamiUserId" SET DATA TYPE VARCHAR(100);
