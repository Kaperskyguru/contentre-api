/*
  Warnings:

  - You are about to drop the column `profileId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profile` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_profileId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "profileId",
ADD COLUMN     "profile" VARCHAR(2048) NOT NULL;

-- DropTable
DROP TABLE "Profile";
