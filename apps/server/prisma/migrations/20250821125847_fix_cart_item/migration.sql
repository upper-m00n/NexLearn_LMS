/*
  Warnings:

  - A unique constraint covering the columns `[cartId,courseId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CartItem_cartId_key";

-- DropIndex
DROP INDEX "CartItem_courseId_key";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_courseId_key" ON "CartItem"("cartId", "courseId");
