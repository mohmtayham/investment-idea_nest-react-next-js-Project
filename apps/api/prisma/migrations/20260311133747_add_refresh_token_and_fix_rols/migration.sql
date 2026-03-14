-- CreateTable
CREATE TABLE `business_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ideaId` INTEGER NOT NULL,
    `key_partners` TEXT NULL,
    `key_activities` TEXT NULL,
    `key_resources` TEXT NULL,
    `value_proposition` TEXT NULL,
    `customer_relationships` TEXT NULL,
    `channels` TEXT NULL,
    `customer_segments` TEXT NULL,
    `cost_structure` TEXT NULL,
    `revenue_streams` TEXT NULL,
    `status` ENUM('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_REVISION') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `business_plans` ADD CONSTRAINT `business_plans_ideaId_fkey` FOREIGN KEY (`ideaId`) REFERENCES `ideas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
