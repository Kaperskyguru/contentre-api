-- CreateFunction
BEGIN;
CREATE OR REPLACE FUNCTION now_plus_60_minutes()
  RETURNS TIMESTAMP
  LANGUAGE plpgsql
  AS $$
BEGIN
  RETURN NOW() AT TIME ZONE 'UTC' + INTERVAL '60 minutes';
END;
$$;
COMMIT;

-- CreateEnum
CREATE TYPE "VerificationIntentType" AS ENUM ('EMAIL', 'PHONE');

-- CreateTable
CREATE TABLE "VerificationIntent" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    "userId" CHAR(36) NOT NULL,
    "type" "VerificationIntentType" NOT NULL,
    "ipAddress" VARCHAR(45) NOT NULL DEFAULT E'::1',
    "refreshCode" VARCHAR(100) NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL DEFAULT now_plus_60_minutes(),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationIntent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VerificationIntent" ADD CONSTRAINT "VerificationIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
