/*
  Warnings:

  - You are about to drop the column `verificationExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationKey` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailVerificationKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetPasswordKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "verificationExpiry",
DROP COLUMN "verificationKey",
ADD COLUMN     "emailVerificationExpiry" TIMESTAMP(3),
ADD COLUMN     "emailVerificationKey" TEXT,
ADD COLUMN     "resetPasswordExpiry" TIMESTAMP(3),
ADD COLUMN     "resetPasswordKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerificationKey_key" ON "public"."User"("emailVerificationKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordKey_key" ON "public"."User"("resetPasswordKey");
