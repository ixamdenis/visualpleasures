/*
  Warnings:

  - You are about to drop the column `isPublished` on the `Gallery` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GalleryStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "isPublished",
ADD COLUMN     "adminFeedback" TEXT,
ADD COLUMN     "status" "GalleryStatus" NOT NULL DEFAULT 'PENDING';
