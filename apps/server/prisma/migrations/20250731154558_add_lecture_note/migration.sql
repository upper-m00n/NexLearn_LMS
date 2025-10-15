/*
  Warnings:

  - A unique constraint covering the columns `[noteId]` on the table `Lecture` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "noteId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_noteId_key" ON "Lecture"("noteId");

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;
