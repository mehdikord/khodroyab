-- Collaborators (کاربران همکار): collaborator prices on ads and price tables,
-- identity verification, and self-registration without admin approval.

-- AlterTable
ALTER TABLE `users`
    ADD COLUMN `collabrate` BOOLEAN NOT NULL DEFAULT false AFTER `approved_at`,
    ADD COLUMN `authenticaed` BOOLEAN NOT NULL DEFAULT false AFTER `collabrate`;

-- Sign-ups no longer wait for the admin: approve everyone still in the queue.
UPDATE `users` SET `is_active` = true, `approved_at` = CURRENT_TIMESTAMP WHERE `approved_at` IS NULL;

-- AlterTable: existing prices become the public price; collaborator prices start empty.
ALTER TABLE `user_car_sale_terms`
    ADD COLUMN `partner_price` VARCHAR(255) NULL AFTER `price`;

-- AlterTable
ALTER TABLE `user_price_table_prices`
    ADD COLUMN `partner_price_usd` VARCHAR(255) NULL AFTER `instant_price`,
    ADD COLUMN `partner_clearance_price` VARCHAR(255) NULL AFTER `partner_price_usd`,
    ADD COLUMN `partner_instant_price` VARCHAR(255) NULL AFTER `partner_clearance_price`;

-- CreateTable
CREATE TABLE `user_verifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `person_type` ENUM('natural', 'legal') NOT NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `reject_reason` TEXT NULL,
    `reviewed_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `user_verifications_user_id_key`(`user_id`),
    INDEX `user_verifications_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_verification_documents` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `verification_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `user_verification_documents_verification_id_idx`(`verification_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_verifications` ADD CONSTRAINT `user_verifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_verification_documents` ADD CONSTRAINT `user_verification_documents_verification_id_fkey` FOREIGN KEY (`verification_id`) REFERENCES `user_verifications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
