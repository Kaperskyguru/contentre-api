-- CreateEnum
CREATE TYPE "ContentClass" AS ENUM ('ARTICLE', 'OUTLINE', 'SNIPPET', 'BRIEF', 'NOTE', 'IDEA');

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "class" "ContentClass" NOT NULL DEFAULT E'ARTICLE';
