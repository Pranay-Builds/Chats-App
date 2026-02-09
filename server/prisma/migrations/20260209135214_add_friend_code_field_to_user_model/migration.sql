/*
  Warnings:

  - A unique constraint covering the columns `[friendCode]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "friendCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_friendCode_key" ON "user"("friendCode");
