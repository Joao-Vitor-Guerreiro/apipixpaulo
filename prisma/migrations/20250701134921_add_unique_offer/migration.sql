/*
  Warnings:

  - A unique constraint covering the columns `[offer]` on the table `Checkout` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Checkout_offer_key" ON "Checkout"("offer");
