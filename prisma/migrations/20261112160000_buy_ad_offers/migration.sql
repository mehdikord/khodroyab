-- AlterTable: currency of the offers and the bidding switch of a buy ad.
ALTER TABLE `user_buy_ads` ADD COLUMN `currency` ENUM('rial', 'usd') NOT NULL DEFAULT 'rial',
    ADD COLUMN `bidding_open` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable: price offers of collaborators on buy ads (one per bidder).
CREATE TABLE `user_buy_ad_offers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `buy_ad_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `price` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `user_buy_ad_offers_buy_ad_id_user_id_key`(`buy_ad_id`, `user_id`),
    INDEX `user_buy_ad_offers_buy_ad_id_price_idx`(`buy_ad_id`, `price`),
    INDEX `user_buy_ad_offers_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_buy_ad_offers` ADD CONSTRAINT `user_buy_ad_offers_buy_ad_id_fkey` FOREIGN KEY (`buy_ad_id`) REFERENCES `user_buy_ads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_buy_ad_offers` ADD CONSTRAINT `user_buy_ad_offers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
