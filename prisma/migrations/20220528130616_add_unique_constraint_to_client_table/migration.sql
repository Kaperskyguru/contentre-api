/*
  Warnings:

  - A unique constraint covering the columns `[name,userId,website]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "name_userId_website_unique_constraint" ON "Client"("name", "userId", "website");
