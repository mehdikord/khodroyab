-- CreateTable
CREATE TABLE `colors` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(7) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `colors_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Carry the free-text colours customers already typed into the catalogue so
-- existing price-table rows keep their colour. Unknown names get a neutral
-- grey code that the administrator can correct from the colours page.
INSERT INTO `colors` (`name`, `code`, `created_at`, `updated_at`)
SELECT
    `t`.`name`,
    CASE `t`.`name`
        WHEN 'سفید' THEN '#ffffff'
        WHEN 'مشکی' THEN '#000000'
        WHEN 'نقره‌ای' THEN '#c0c0c0'
        WHEN 'نقره ای' THEN '#c0c0c0'
        WHEN 'خاکستری' THEN '#808080'
        WHEN 'قرمز' THEN '#dc2626'
        WHEN 'آبی' THEN '#2563eb'
        WHEN 'سبز' THEN '#16a34a'
        WHEN 'زرد' THEN '#facc15'
        WHEN 'نارنجی' THEN '#f97316'
        WHEN 'قهوه‌ای' THEN '#78350f'
        WHEN 'قهوه ای' THEN '#78350f'
        WHEN 'بژ' THEN '#d6c6a5'
        ELSE '#9ca3af'
    END,
    CURRENT_TIMESTAMP(0),
    CURRENT_TIMESTAMP(0)
FROM (
    SELECT DISTINCT TRIM(`color`) AS `name`
    FROM `user_price_table_entries`
    WHERE TRIM(`color`) <> ''
) AS `t`;

-- AlterTable
ALTER TABLE `cars` ADD COLUMN `color_id` BIGINT UNSIGNED NULL;

-- AlterTable
ALTER TABLE `user_price_table_entries` ADD COLUMN `clearance_price` VARCHAR(255) NULL,
    ADD COLUMN `color_id` BIGINT UNSIGNED NULL,
    ADD COLUMN `instant_price` VARCHAR(255) NULL,
    MODIFY `price_usd` VARCHAR(255) NULL;

-- Link existing price-table rows to the colours created above.
UPDATE `user_price_table_entries` AS `e`
INNER JOIN `colors` AS `c` ON `c`.`name` = TRIM(`e`.`color`)
SET `e`.`color_id` = `c`.`id`;

-- AlterTable
ALTER TABLE `user_price_table_entries` DROP COLUMN `color`;

-- CreateIndex
CREATE INDEX `cars_color_id_idx` ON `cars`(`color_id`);

-- CreateIndex
CREATE INDEX `user_price_table_entries_color_id_idx` ON `user_price_table_entries`(`color_id`);

-- AddForeignKey
ALTER TABLE `cars` ADD CONSTRAINT `cars_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_price_table_entries` ADD CONSTRAINT `user_price_table_entries_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
