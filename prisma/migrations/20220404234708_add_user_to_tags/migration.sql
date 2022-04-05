-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "userId" CHAR(36);

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
