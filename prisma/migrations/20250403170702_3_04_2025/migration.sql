/*
  Warnings:

  - You are about to drop the column `toComent` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `project` table. All the data in the column will be lost.
  - You are about to drop the `status` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assignedusers` DROP FOREIGN KEY `AssignedUsers_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `assignedusers` DROP FOREIGN KEY `AssignedUsers_userId_fkey`;

-- DropForeignKey
ALTER TABLE `status` DROP FOREIGN KEY `Status_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_projectId_fkey`;

-- DropIndex
DROP INDEX `AssignedUsers_projectId_fkey` ON `assignedusers`;

-- DropIndex
DROP INDEX `Task_projectId_fkey` ON `task`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `toComent`;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `description`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `label` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `status`;

-- AddForeignKey
ALTER TABLE `AssignedUsers` ADD CONSTRAINT `AssignedUsers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignedUsers` ADD CONSTRAINT `AssignedUsers_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
