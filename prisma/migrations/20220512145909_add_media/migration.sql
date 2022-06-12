-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('VIDEO', 'IMAGE', 'AUDIO');

-- CreateTable
CREATE TABLE "Media" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "teamId" CHAR(36) NOT NULL,
    "title" VARCHAR(2048),
    "type" "MediaType" NOT NULL DEFAULT E'IMAGE',
    "url" VARCHAR(2048) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
