-- Purchase requests (درخواست خرید) and their status history.
-- CreateTable
CREATE TABLE `purchase_requests` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `source` ENUM('sale_ad', 'price_list') NOT NULL,
    `status` ENUM('received', 'in_progress', 'cancelled', 'completed', 'no_answer') NOT NULL DEFAULT 'received',
    `is_guest` BOOLEAN NOT NULL,
    `requester_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `requester_code` VARCHAR(8) NULL,
    `province_id` INTEGER UNSIGNED NULL,
    `city_id` INTEGER UNSIGNED NULL,
    `description` VARCHAR(1000) NULL,
    `seller_id` BIGINT UNSIGNED NULL,
    `seller_code` VARCHAR(8) NOT NULL,
    `car_id` BIGINT UNSIGNED NULL,
    `car_label` VARCHAR(255) NOT NULL,
    `user_car_id` BIGINT UNSIGNED NULL,
    `ad_code` VARCHAR(6) NULL,
    `year` VARCHAR(10) NULL,
    `color_id` BIGINT UNSIGNED NULL,
    `color_name` VARCHAR(255) NULL,
    `currency` ENUM('rial', 'usd') NULL,
    `price_snapshot` JSON NULL,
    `admin_note` TEXT NULL,
    `seen_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `purchase_requests_is_guest_created_at_idx`(`is_guest`, `created_at`),
    INDEX `purchase_requests_requester_id_idx`(`requester_id`),
    INDEX `purchase_requests_seller_id_idx`(`seller_id`),
    INDEX `purchase_requests_car_id_idx`(`car_id`),
    INDEX `purchase_requests_user_car_id_idx`(`user_car_id`),
    INDEX `purchase_requests_color_id_idx`(`color_id`),
    INDEX `purchase_requests_province_id_idx`(`province_id`),
    INDEX `purchase_requests_city_id_idx`(`city_id`),
    INDEX `purchase_requests_status_idx`(`status`),
    INDEX `purchase_requests_seen_at_idx`(`seen_at`),
    INDEX `purchase_requests_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_request_status_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `request_id` BIGINT UNSIGNED NOT NULL,
    `from_status` ENUM('received', 'in_progress', 'cancelled', 'completed', 'no_answer') NULL,
    `to_status` ENUM('received', 'in_progress', 'cancelled', 'completed', 'no_answer') NOT NULL,
    `admin_id` BIGINT UNSIGNED NULL,
    `admin_name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `purchase_request_status_logs_request_id_created_at_idx`(`request_id`, `created_at`),
    INDEX `purchase_request_status_logs_admin_id_idx`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `purchase_requests` ADD CONSTRAINT `purchase_requests_requester_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_requests` ADD CONSTRAINT `purchase_requests_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_requests` ADD CONSTRAINT `purchase_requests_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_requests` ADD CONSTRAINT `purchase_requests_user_car_id_fkey` FOREIGN KEY (`user_car_id`) REFERENCES `user_cars`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_requests` ADD CONSTRAINT `purchase_requests_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_requests` ADD CONSTRAINT `purchase_requests_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_requests` ADD CONSTRAINT `purchase_requests_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_request_status_logs` ADD CONSTRAINT `purchase_request_status_logs_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `purchase_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_request_status_logs` ADD CONSTRAINT `purchase_request_status_logs_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

