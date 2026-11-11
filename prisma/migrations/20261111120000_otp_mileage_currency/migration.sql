-- AlterTable
ALTER TABLE `user_cars` ADD COLUMN `currency` ENUM('rial', 'usd') NOT NULL DEFAULT 'rial',
    ADD COLUMN `mileage` INTEGER UNSIGNED NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user_price_table_entries` ADD COLUMN `currency` ENUM('rial', 'usd') NOT NULL DEFAULT 'usd';

-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `user_otps` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(20) NOT NULL,
    `code_hash` VARCHAR(64) NOT NULL,
    `attempts` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `expires_at` TIMESTAMP(0) NOT NULL,
    `consumed_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_otps_phone_created_at_idx`(`phone`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

