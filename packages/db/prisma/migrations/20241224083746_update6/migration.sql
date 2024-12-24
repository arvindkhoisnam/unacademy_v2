/*
  Warnings:

  - Added the required column `epoch` to the `Payload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payload" ADD COLUMN     "epoch" BIGINT NOT NULL;
