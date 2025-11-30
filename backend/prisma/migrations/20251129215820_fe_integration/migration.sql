/*
  Warnings:

  - A unique constraint covering the columns `[txnId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "OrderKind" AS ENUM ('NEW', 'OLD', 'MIXED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('UPI', 'Card', 'Cash', 'NEFT', 'PO');

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "contact" TEXT,
ADD COLUMN     "enrollment" TEXT,
ADD COLUMN     "feedbackType" TEXT,
ADD COLUMN     "senderRole" "Role";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT,
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "orderKind" "OrderKind" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "orderedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'UPI',
ADD COLUMN     "requestedFrom" TEXT,
ADD COLUMN     "txnId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "Zone" ADD COLUMN     "address" TEXT,
ADD COLUMN     "distanceKm" DOUBLE PRECISION,
ADD COLUMN     "note" TEXT DEFAULT '',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 4.2;

-- CreateTable
CREATE TABLE "BulkRequest" (
    "id" TEXT NOT NULL,
    "requestor" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "bookCode" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "note" TEXT,
    "payment" "PaymentMode" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Requested',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BulkRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickupRequest" (
    "id" TEXT NOT NULL,
    "enrollment" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PickupRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_txnId_key" ON "Order"("txnId");

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
