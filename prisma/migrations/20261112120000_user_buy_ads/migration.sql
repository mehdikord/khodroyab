-- CreateTable: buy ads (آگهی خرید) — a collaborator requests a car.
CREATE TABLE `user_buy_ads` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `car_id` BIGINT UNSIGNED NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `year` VARCHAR(10) NOT NULL,
    `mileage` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `color_id` BIGINT UNSIGNED NOT NULL,
    `description` VARCHAR(1000) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `user_buy_ads_code_key`(`code`),
    INDEX `user_buy_ads_user_id_idx`(`user_id`),
    INDEX `user_buy_ads_car_id_idx`(`car_id`),
    INDEX `user_buy_ads_color_id_idx`(`color_id`),
    INDEX `user_buy_ads_year_idx`(`year`),
    INDEX `user_buy_ads_is_active_created_at_idx`(`is_active`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_buy_ads` ADD CONSTRAINT `user_buy_ads_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_buy_ads` ADD CONSTRAINT `user_buy_ads_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_buy_ads` ADD CONSTRAINT `user_buy_ads_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
