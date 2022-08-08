/*
  Warnings:

  - You are about to drop the column `contentId` on the `Topic` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_contentId_fkey";

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "topics" JSON;

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "contentId";
