/*
  Warnings:

  - The primary key for the `shelf` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `shelf` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(31)`.
  - The primary key for the `vault` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `shelf` DROP FOREIGN KEY `shelf_vault_id_fkey`;

-- AlterTable
ALTER TABLE `shelf` DROP PRIMARY KEY,
    ADD COLUMN `label` VARCHAR(63) NOT NULL DEFAULT 'unnamed',
    MODIFY `id` VARCHAR(31) NOT NULL,
    MODIFY `vault_id` VARCHAR(16) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `vault` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(15) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `shelf` ADD CONSTRAINT `shelf_vault_id_fkey` FOREIGN KEY (`vault_id`) REFERENCES `vault`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
