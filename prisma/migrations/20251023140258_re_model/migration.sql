/*
  Warnings:

  - You are about to drop the column `lady_id` on the `Orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_lady_id_fkey`;

-- DropIndex
DROP INDEX `Orders_lady_id_fkey` ON `Orders`;

-- AlterTable
ALTER TABLE `Billings` ADD COLUMN `lady_charge` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `lady_id`;

-- CreateTable
CREATE TABLE `LadyOrders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `lady_id` INTEGER NULL,
    `hours` INTEGER NOT NULL,
    `order_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LadyOrders` ADD CONSTRAINT `LadyOrders_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `Sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LadyOrders` ADD CONSTRAINT `LadyOrders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LadyOrders` ADD CONSTRAINT `LadyOrders_lady_id_fkey` FOREIGN KEY (`lady_id`) REFERENCES `Lady`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
