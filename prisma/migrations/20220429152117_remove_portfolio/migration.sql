/*
  Warnings:

  - You are about to drop the column `portfolio` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN  "portfolioURL" VARCHAR(2048);

do $$
  declare
    userRecord record;
  begin
    for userRecord in
      select * from "User"
    loop
        UPDATE "User" u SET "portfolioURL" = userRecord.portfolio WHERE u."id" = userRecord.id;
    end loop;
  end;
$$;

ALTER TABLE "User" DROP COLUMN "portfolio";
