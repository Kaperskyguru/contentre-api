-- CreateTable
CREATE TABLE "Client" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(60) NOT NULL,
    "website" VARCHAR(2048),

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
