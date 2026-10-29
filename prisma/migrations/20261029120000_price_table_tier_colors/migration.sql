-- Colour moves from the price-table row (one per car) onto each price tier,
-- so a customer can price the same year in several colours.

-- AlterTable
ALTER TABLE `user_price_table_prices` ADD COLUMN `color_id` BIGINT UNSIGNED NULL AFTER `year`;

-- Every existing tier inherits its row's colour.
UPDATE `user_price_table_prices` AS `p`
INNER JOIN `user_price_table_entries` AS `e` ON `e`.`id` = `p`.`entry_id`
SET `p`.`color_id` = `e`.`color_id`;

-- Rows saved before colours were mandatory cannot be represented any more.
DELETE FROM `user_price_table_prices` WHERE `color_id` IS NULL;

ALTER TABLE `user_price_table_prices` MODIFY `color_id` BIGINT UNSIGNED NOT NULL;

-- Uniqueness is now (row, year, colour). The new index is created first because
-- the entry_id foreign key needs an index that starts with entry_id.
CREATE UNIQUE INDEX `user_price_table_prices_entry_id_year_color_id_key` ON `user_price_table_prices`(`entry_id`, `year`, `color_id`);
DROP INDEX `user_price_table_prices_entry_id_year_key` ON `user_price_table_prices`;

-- CreateIndex
CREATE INDEX `user_price_table_prices_color_id_idx` ON `user_price_table_prices`(`color_id`);

-- AddForeignKey
ALTER TABLE `user_price_table_prices` ADD CONSTRAINT `user_price_table_prices_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop the row-level colour.
ALTER TABLE `user_price_table_entries` DROP FOREIGN KEY `user_price_table_entries_color_id_fkey`;
DROP INDEX `user_price_table_entries_color_id_idx` ON `user_price_table_entries`;
ALTER TABLE `user_price_table_entries` DROP COLUMN `color_id`;
