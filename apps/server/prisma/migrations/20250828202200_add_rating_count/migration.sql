-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "ratingCount" INTEGER DEFAULT 0,
ALTER COLUMN "rating" SET DEFAULT 0;
