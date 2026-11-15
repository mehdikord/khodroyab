-- AlterTable
ALTER TABLE `cars` ADD COLUMN `description` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `car_videos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `car_id` BIGINT UNSIGNED NOT NULL,
    `video_url` VARCHAR(255) NOT NULL,
    `size_bytes` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `car_videos_car_id_idx`(`car_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `car_videos` ADD CONSTRAINT `car_videos_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

