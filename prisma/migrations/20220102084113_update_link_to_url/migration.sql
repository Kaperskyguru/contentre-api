/*
  Warnings:

  - You are about to drop the column `link` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "link",
ADD COLUMN     "url" VARCHAR(2048),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "content" SET DATA TYPE TEXT;
