-- Identity details of a collaborator's verification submission.
-- Natural person: business-license owner's name and national code.
-- Legal entity: company name, company national ID, CEO's name and national code.
-- Nullable so submissions sent before these fields existed stay valid.

-- AlterTable
ALTER TABLE `user_verifications`
    ADD COLUMN `full_name` VARCHAR(120) NULL AFTER `person_type`,
    ADD COLUMN `national_code` VARCHAR(10) NULL AFTER `full_name`,
    ADD COLUMN `company_name` VARCHAR(255) NULL AFTER `national_code`,
    ADD COLUMN `company_national_id` VARCHAR(11) NULL AFTER `company_name`;
