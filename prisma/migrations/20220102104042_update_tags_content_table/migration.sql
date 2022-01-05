/*
  Warnings:

  - You are about to drop the column `contentId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_contentId_fkey";

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "contentId";
