-- Add the public 6-digit ad code and the moderation status to `user_cars`.
-- Existing rows were created by administrators, so they are back-filled as
-- `approved` and receive a deterministic code derived from their id.

-- AlterTable (code is added as NULL first so existing rows can be back-filled)
ALTER TABLE `user_cars` ADD COLUMN `code` VARCHAR(6) NULL,
    ADD COLUMN `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending';

-- Back-fill existing ads
UPDATE `user_cars`
SET `code` = LPAD(`id` MOD 1000000, 6, '0'),
    `status` = 'approved'
WHERE `code` IS NULL;

-- Enforce NOT NULL now that every row has a code
ALTER TABLE `user_cars` MODIFY `code` VARCHAR(6) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_cars_code_key` ON `user_cars`(`code`);

-- CreateIndex
CREATE INDEX `user_cars_status_idx` ON `user_cars`(`status`);
