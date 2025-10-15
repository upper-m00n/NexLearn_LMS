/*
  Warnings:

  - A unique constraint covering the columns `[courseId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CartItem_courseId_key" ON "CartItem"("courseId");
