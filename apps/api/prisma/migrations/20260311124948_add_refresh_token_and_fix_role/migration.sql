-- AlterTable
ALTER TABLE `users` ADD COLUMN `hashed_refresh_token` TEXT NULL;

-- CreateTable
CREATE TABLE `profit_distributions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DECIMAL(15, 2) NOT NULL,
    `share_percentage` DOUBLE NULL,
    `notes` TEXT NULL,
    `distributed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ideaId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profit_distributions` ADD CONSTRAINT `profit_distributions_ideaId_fkey` FOREIGN KEY (`ideaId`) REFERENCES `ideas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profit_distributions` ADD CONSTRAINT `profit_distributions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
