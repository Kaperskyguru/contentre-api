-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('TEMPLATE', 'CUSTOMIZED');

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "slug" VARCHAR(2048) NOT NULL DEFAULT E'Default',
ADD COLUMN     "type" "TemplateType" NOT NULL DEFAULT E'TEMPLATE';
