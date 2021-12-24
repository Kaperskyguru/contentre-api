/*
  Warnings:

  - You are about to drop the column `authorsLink` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "authorsLink",
ADD COLUMN     "profileId" CHAR(36);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" VARCHAR(2048),
ADD COLUMN     "firstname" VARCHAR(35),
ADD COLUMN     "homeAddress" VARCHAR(2048),
ADD COLUMN     "jobTitle" VARCHAR(60),
ADD COLUMN     "lastname" VARCHAR(35),
ADD COLUMN     "portfolio" VARCHAR(2048),
ADD COLUMN     "skype" VARCHAR(35);

-- CreateTable
CREATE TABLE "Profile" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "link" VARCHAR(2048) NOT NULL,
    "avatar" VARCHAR(2048),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "link" VARCHAR(2048) NOT NULL,
    "icon" VARCHAR(2048),
    "userId" CHAR(36) NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Social" ADD CONSTRAINT "Social_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
