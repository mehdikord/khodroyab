-- CreateTable
CREATE TABLE `user_car_sale_term_price_histories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_car_sale_term_id` BIGINT UNSIGNED NOT NULL,
    `price` VARCHAR(255) NOT NULL,
    `source` ENUM('user', 'admin', 'system') NOT NULL DEFAULT 'user',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_car_sale_term_price_histories_user_car_sale_term_id_cre_idx`(`user_car_sale_term_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_car_sale_term_price_histories` ADD CONSTRAINT `user_car_sale_term_price_histories_user_car_sale_term_id_fkey` FOREIGN KEY (`user_car_sale_term_id`) REFERENCES `user_car_sale_terms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Back-fill: every existing sale term gets its current price as the first
-- history entry, dated when the term was created, so charts start at the
-- original listing price and the first real edit produces a delta.
INSERT INTO `user_car_sale_term_price_histories` (`user_car_sale_term_id`, `price`, `source`, `created_at`)
SELECT `id`, `price`, 'system', `created_at`
FROM `user_car_sale_terms`;
