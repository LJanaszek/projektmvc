/*
  Warnings:

  - You are about to drop the column `description` on the `project` table. All the data in the column will be lost.
  - Added the required column `description` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `description`;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `description` VARCHAR(191) NOT NULL;
