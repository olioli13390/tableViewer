/*
  Warnings:

  - Added the required column `user_id` to the `CsvFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `csvfile` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CsvFile` ADD CONSTRAINT `CsvFile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
