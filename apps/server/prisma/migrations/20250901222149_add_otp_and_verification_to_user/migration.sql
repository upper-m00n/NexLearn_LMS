/*
  Warnings:

  - You are about to drop the column `opt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "opt",
ADD COLUMN     "otp" TEXT;
