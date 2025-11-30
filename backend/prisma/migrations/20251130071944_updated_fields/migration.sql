/*
  Warnings:

  - The values [Card,Cash] on the enum `PaymentMode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMode_new" AS ENUM ('UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NETBANKING', 'NEFT', 'DEMAND_DRAFT', 'PO');
ALTER TABLE "public"."Order" ALTER COLUMN "paymentMode" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "paymentMode" TYPE "PaymentMode_new" USING ("paymentMode"::text::"PaymentMode_new");
ALTER TABLE "BulkRequest" ALTER COLUMN "payment" TYPE "PaymentMode_new" USING ("payment"::text::"PaymentMode_new");
ALTER TYPE "PaymentMode" RENAME TO "PaymentMode_old";
ALTER TYPE "PaymentMode_new" RENAME TO "PaymentMode";
DROP TYPE "public"."PaymentMode_old";
ALTER TABLE "Order" ALTER COLUMN "paymentMode" SET DEFAULT 'UPI';
COMMIT;
