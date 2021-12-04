-- CreateTable
CREATE TABLE `vault` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shelf` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(1023) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `vault_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shelf` ADD CONSTRAINT `shelf_vault_id_fkey` FOREIGN KEY (`vault_id`) REFERENCES `vault`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
