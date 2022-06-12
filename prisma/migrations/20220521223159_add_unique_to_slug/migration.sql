/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Template` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "uniqueSlug" ON "Template"("slug");
