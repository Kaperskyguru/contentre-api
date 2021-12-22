/*
  Warnings:

  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `ipAddress` on the `VerificationIntent` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" VARCHAR(60),
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "VerificationIntent" DROP COLUMN "ipAddress";
