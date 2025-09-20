/*
  Warnings:

  - Added the required column `approved` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "approved" BOOLEAN NOT NULL;
