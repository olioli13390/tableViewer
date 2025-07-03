-- CreateTable
CREATE TABLE `SqlQuery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `sql_text` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `id_dataBaseConnection` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SqlQuery` ADD CONSTRAINT `SqlQuery_id_dataBaseConnection_fkey` FOREIGN KEY (`id_dataBaseConnection`) REFERENCES `DataBaseConnection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
