/*
  Warnings:

  - You are about to drop the column `status` on the `column` table. All the data in the column will be lost.
  - Added the required column `name` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `column` DROP COLUMN `status`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
