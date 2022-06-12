-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_clientId_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "clientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
