-- AlterTable: optional business name shown to other customers instead of the person's name.
ALTER TABLE `users` ADD COLUMN `company_name` VARCHAR(255) NULL AFTER `name`;

-- CreateTable: per-year price tiers of a price-table row.
CREATE TABLE `user_price_table_prices` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `entry_id` BIGINT UNSIGNED NOT NULL,
    `year` VARCHAR(10) NOT NULL,
    `price_usd` VARCHAR(255) NULL,
    `clearance_price` VARCHAR(255) NULL,
    `instant_price` VARCHAR(255) NULL,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `user_price_table_prices_entry_id_year_key`(`entry_id`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Move the existing single set of prices into a first tier whose year is the
-- car's catalogue year (the default the editor proposes for new rows).
INSERT INTO `user_price_table_prices`
    (`entry_id`, `year`, `price_usd`, `clearance_price`, `instant_price`, `sort_order`, `created_at`, `updated_at`)
SELECT
    `e`.`id`,
    LEFT(TRIM(`c`.`year`), 10),
    `e`.`price_usd`,
    `e`.`clearance_price`,
    `e`.`instant_price`,
    0,
    `e`.`created_at`,
    `e`.`updated_at`
FROM `user_price_table_entries` AS `e`
INNER JOIN `cars` AS `c` ON `c`.`id` = `e`.`car_id`
WHERE `e`.`price_usd` IS NOT NULL
   OR `e`.`clearance_price` IS NOT NULL
   OR `e`.`instant_price` IS NOT NULL;

-- AlterTable
ALTER TABLE `user_price_table_entries` DROP COLUMN `price_usd`,
    DROP COLUMN `clearance_price`,
    DROP COLUMN `instant_price`;

-- AddForeignKey
ALTER TABLE `user_price_table_prices` ADD CONSTRAINT `user_price_table_prices_entry_id_fkey` FOREIGN KEY (`entry_id`) REFERENCES `user_price_table_entries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `sponsors` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `logo` VARCHAR(1024) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `sponsors_is_active_sort_order_idx`(`is_active`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
