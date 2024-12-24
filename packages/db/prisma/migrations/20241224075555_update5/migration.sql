/*
  Warnings:

  - The `x` column on the `Payload` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `y` column on the `Payload` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `adminHeight` column on the `Payload` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `adminWidth` column on the `Payload` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Payload" DROP COLUMN "x",
ADD COLUMN     "x" INTEGER,
DROP COLUMN "y",
ADD COLUMN     "y" INTEGER,
DROP COLUMN "adminHeight",
ADD COLUMN     "adminHeight" INTEGER,
DROP COLUMN "adminWidth",
ADD COLUMN     "adminWidth" INTEGER;
