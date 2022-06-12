-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "css" TEXT,
ALTER COLUMN "visibility" SET DEFAULT E'PUBLIC';

-- AlterTable
ALTER TABLE "UserTemplate" ADD COLUMN     "css" TEXT;
