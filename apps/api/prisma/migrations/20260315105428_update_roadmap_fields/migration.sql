-- AlterTable
ALTER TABLE `roadmaps` ADD COLUMN `last_update` DATETIME(3) NULL,
    ADD COLUMN `next_step` VARCHAR(191) NULL,
    ADD COLUMN `stage_description` TEXT NULL;
