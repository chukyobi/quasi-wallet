-- AlterTable
ALTER TABLE `User` ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `otp` VARCHAR(191) NULL,
    ADD COLUMN `otpExpires` DATETIME(3) NULL;