/*
  Warnings:

  - A unique constraint covering the columns `[ghostId]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ghostId` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "ghostId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_ghostId_key" ON "Sale"("ghostId");
