/*
  Warnings:

  - Made the column `url` on table `Content` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "url" SET NOT NULL;
