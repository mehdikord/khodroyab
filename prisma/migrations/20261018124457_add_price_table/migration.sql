-- AlterTable
ALTER TABLE `cars` ADD COLUMN `price_table` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `user_price_table_entries` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `car_id` BIGINT UNSIGNED NOT NULL,
    `color` VARCHAR(255) NOT NULL,
    `price_usd` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `user_price_table_entries_car_id_idx`(`car_id`),
    UNIQUE INDEX `user_price_table_entries_user_id_car_id_key`(`user_id`, `car_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_price_table_entries` ADD CONSTRAINT `user_price_table_entries_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_price_table_entries` ADD CONSTRAINT `user_price_table_entries_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
