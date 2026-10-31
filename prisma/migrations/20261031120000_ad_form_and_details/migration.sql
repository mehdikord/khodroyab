-- Year, colour and feature values move from the car catalogue onto each sale
-- ad; options become global "car registration form" fields; ads get own photos.

-- The legacy "رنگ" option is replaced by the ad's colour from the `colors` catalogue.
DELETE `co` FROM `car_options` AS `co`
INNER JOIN `options` AS `o` ON `o`.`id` = `co`.`option_id`
WHERE `o`.`name` = 'رنگ' AND `o`.`type` = 'select';

DELETE `oi` FROM `option_items` AS `oi`
INNER JOIN `options` AS `o` ON `o`.`id` = `oi`.`option_id`
WHERE `o`.`name` = 'رنگ' AND `o`.`type` = 'select';

DELETE FROM `options` WHERE `name` = 'رنگ' AND `type` = 'select';

-- AlterTable
ALTER TABLE `options`
    MODIFY `type` ENUM('text', 'number', 'select', 'checkbox') NOT NULL DEFAULT 'text',
    ADD COLUMN `multiple` BOOLEAN NOT NULL DEFAULT false AFTER `type`,
    ADD COLUMN `is_required` BOOLEAN NOT NULL DEFAULT false AFTER `multiple`,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true AFTER `is_required`,
    DROP COLUMN `placeholder`;

-- AlterTable
ALTER TABLE `option_items` DROP COLUMN `item`;

-- AlterTable
ALTER TABLE `user_cars`
    ADD COLUMN `year` VARCHAR(10) NOT NULL DEFAULT '' AFTER `description`,
    ADD COLUMN `color_id` BIGINT UNSIGNED NULL AFTER `year`;

-- Every existing ad inherits the year and colour of its car.
UPDATE `user_cars` AS `uc`
INNER JOIN `cars` AS `c` ON `c`.`id` = `uc`.`car_id`
SET `uc`.`year` = LEFT(`c`.`year`, 10), `uc`.`color_id` = `c`.`color_id`;

ALTER TABLE `user_cars` ALTER COLUMN `year` DROP DEFAULT;

-- CreateTable
CREATE TABLE `user_car_images` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_car_id` BIGINT UNSIGNED NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `is_primary` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `user_car_images_user_car_id_idx`(`user_car_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_car_options` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_car_id` BIGINT UNSIGNED NOT NULL,
    `option_id` BIGINT UNSIGNED NOT NULL,
    `option_item_id` BIGINT UNSIGNED NULL,
    `val` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `user_car_options_user_car_id_idx`(`user_car_id`),
    INDEX `user_car_options_option_id_idx`(`option_id`),
    INDEX `user_car_options_option_item_id_idx`(`option_item_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Copy each car's feature values onto all of its ads. Select values held an
-- option_items id; an unchecked checkbox ("0") and stale item ids have no row.
INSERT INTO `user_car_options` (`user_car_id`, `option_id`, `option_item_id`, `val`, `updated_at`)
SELECT `uc`.`id`, `co`.`option_id`, `oi`.`id`, NULL, CURRENT_TIMESTAMP(0)
FROM `car_options` AS `co`
INNER JOIN `options` AS `o` ON `o`.`id` = `co`.`option_id` AND `o`.`type` = 'select'
INNER JOIN `option_items` AS `oi` ON `oi`.`option_id` = `o`.`id` AND CAST(`oi`.`id` AS BINARY) = CAST(`co`.`val` AS BINARY)
INNER JOIN `user_cars` AS `uc` ON `uc`.`car_id` = `co`.`car_id`;

INSERT INTO `user_car_options` (`user_car_id`, `option_id`, `option_item_id`, `val`, `updated_at`)
SELECT `uc`.`id`, `co`.`option_id`, NULL, `co`.`val`, CURRENT_TIMESTAMP(0)
FROM `car_options` AS `co`
INNER JOIN `options` AS `o` ON `o`.`id` = `co`.`option_id`
INNER JOIN `user_cars` AS `uc` ON `uc`.`car_id` = `co`.`car_id`
WHERE (`o`.`type` = 'text' AND `co`.`val` <> '') OR (`o`.`type` = 'checkbox' AND `co`.`val` = '1');

-- DropTable
DROP TABLE `car_options`;

-- Drop the car-level year and colour.
ALTER TABLE `cars` DROP FOREIGN KEY `cars_color_id_fkey`;
DROP INDEX `cars_color_id_idx` ON `cars`;
ALTER TABLE `cars` DROP COLUMN `color_id`, DROP COLUMN `year`;

-- CreateIndex
CREATE INDEX `user_cars_color_id_idx` ON `user_cars`(`color_id`);
CREATE INDEX `user_cars_year_idx` ON `user_cars`(`year`);

-- AddForeignKey
ALTER TABLE `user_cars` ADD CONSTRAINT `user_cars_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `user_car_images` ADD CONSTRAINT `user_car_images_user_car_id_fkey` FOREIGN KEY (`user_car_id`) REFERENCES `user_cars`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `user_car_options` ADD CONSTRAINT `user_car_options_user_car_id_fkey` FOREIGN KEY (`user_car_id`) REFERENCES `user_cars`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `user_car_options` ADD CONSTRAINT `user_car_options_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `user_car_options` ADD CONSTRAINT `user_car_options_option_item_id_fkey` FOREIGN KEY (`option_item_id`) REFERENCES `option_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
