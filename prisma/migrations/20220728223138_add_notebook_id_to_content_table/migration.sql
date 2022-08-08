-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "notebookId" CHAR(36),
ADD COLUMN     "shareLink" VARCHAR(2048),
ADD COLUMN     "shareable" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
