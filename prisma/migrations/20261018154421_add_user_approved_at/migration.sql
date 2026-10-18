-- AlterTable
ALTER TABLE `users` ADD COLUMN `approved_at` TIMESTAMP(0) NULL;

-- Back-fill: every account that already exists was created by an administrator
-- (self-registration did not exist yet), so it counts as approved.
UPDATE `users` SET `approved_at` = `created_at` WHERE `approved_at` IS NULL;
