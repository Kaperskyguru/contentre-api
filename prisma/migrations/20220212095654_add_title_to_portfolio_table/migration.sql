/*
  Warnings:

  - Added the required column `title` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "title" VARCHAR(2048) NOT NULL;
