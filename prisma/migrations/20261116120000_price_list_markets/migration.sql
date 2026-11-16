-- DropForeignKey
ALTER TABLE `user_price_table_entries` DROP FOREIGN KEY `user_price_table_entries_user_id_fkey`;

-- DropIndex
DROP INDEX `user_price_table_entries_user_id_car_id_key` ON `user_price_table_entries`;

-- AlterTable
ALTER TABLE `user_price_table_entries` ADD COLUMN `market` ENUM('free_zone', 'national') NOT NULL DEFAULT 'free_zone';

-- AlterTable
ALTER TABLE `purchase_requests` ADD COLUMN `market` ENUM('free_zone', 'national') NULL;

-- CreateIndex
CREATE INDEX `user_price_table_entries_car_id_market_idx` ON `user_price_table_entries`(`car_id`, `market`);

-- CreateIndex
CREATE UNIQUE INDEX `user_price_table_entries_user_id_car_id_market_key` ON `user_price_table_entries`(`user_id`, `car_id`, `market`);

-- AddForeignKey
ALTER TABLE `user_price_table_entries` ADD CONSTRAINT `user_price_table_entries_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


-- Every existing price-list request came from the (then only) free-zone list.
UPDATE `purchase_requests` SET `market` = 'free_zone' WHERE `source` = 'price_list' AND `market` IS NULL;
