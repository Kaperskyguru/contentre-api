/*
  Warnings:

  - The `tags` column on the `Content` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "categoryId" CHAR(36),
DROP COLUMN "tags",
ADD COLUMN     "tags" JSON;

-- CreateTable
CREATE TABLE "Category" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
