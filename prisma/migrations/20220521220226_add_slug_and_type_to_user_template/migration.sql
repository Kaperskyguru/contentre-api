-- AlterTable
ALTER TABLE "UserTemplate" ADD COLUMN     "slug" VARCHAR(2048) NOT NULL DEFAULT E'Default',
ADD COLUMN     "type" "TemplateType" NOT NULL DEFAULT E'TEMPLATE';
