-- CreateEnum
CREATE TYPE "TemplateVisility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "userId" CHAR(36) NOT NULL,
    "url" VARCHAR(2048) NOT NULL,
    "description" TEXT,
    "type" VARCHAR(36),
    "templateId" CHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "visibility" "TemplateVisility" NOT NULL DEFAULT E'PRIVATE',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTemplate" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "UserTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
