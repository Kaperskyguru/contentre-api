-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "teamId" CHAR(36);

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
