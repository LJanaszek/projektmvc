/*
  Warnings:

  - You are about to drop the column `descryption` on the `project` table. All the data in the column will be lost.
  - Added the required column `descryption` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `descryption`;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `descryption` VARCHAR(191) NOT NULL;
