/*
  Warnings:

  - Added the required column `appId` to the `ConnectedApp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ConnectedApp" ADD COLUMN     "appId" CHAR(36) NOT NULL;

-- CreateTable
CREATE TABLE "App" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "icon" VARCHAR(2048),
    "name" VARCHAR(60) NOT NULL,
    "description" VARCHAR(2048),
    "website" VARCHAR(2048),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConnectedApp" ADD CONSTRAINT "ConnectedApp_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
