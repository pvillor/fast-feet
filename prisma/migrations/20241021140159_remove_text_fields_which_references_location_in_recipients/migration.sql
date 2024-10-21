/*
  Warnings:

  - You are about to drop the column `cep` on the `recipients` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `recipients` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhood` on the `recipients` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `recipients` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `recipients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipients" DROP COLUMN "cep",
DROP COLUMN "city",
DROP COLUMN "neighborhood",
DROP COLUMN "state",
DROP COLUMN "street";
