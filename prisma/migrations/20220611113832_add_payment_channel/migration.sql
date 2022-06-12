-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "channel" "PaymentChannel" NOT NULL DEFAULT E'PAYSTACK';
