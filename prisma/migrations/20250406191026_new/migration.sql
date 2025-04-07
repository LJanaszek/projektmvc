/*
  Warnings:

  - You are about to drop the column `role` on the `assignedusers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label,projectId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `assignedusers` DROP COLUMN `role`;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Project_name_key` ON `Project`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Task_label_projectId_key` ON `Task`(`label`, `projectId`);
