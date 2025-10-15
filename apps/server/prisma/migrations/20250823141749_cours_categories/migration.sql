-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ITSoftware', 'Business', 'Development', 'FinanceAccounting', 'OfficeProductivity', 'PersonalDevelopment', 'Design', 'Marketing', 'Lifestyle', 'PhotographyVideo', 'HealthFitness', 'Music', 'TeachingAcademics');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'Development';
