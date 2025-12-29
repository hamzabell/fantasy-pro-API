/*
  Warnings:

  - You are about to drop the column `allowPowerUps` on the `FantasyLeague` table. All the data in the column will be lost.
  - You are about to drop the `AdminOtpSecret` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FantasyLeagueMembershipPowerUp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PowerUp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PowerUpCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPowerUp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AdminOtpSecret" DROP CONSTRAINT "AdminOtpSecret_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FantasyLeagueMembershipPowerUp" DROP CONSTRAINT "FantasyLeagueMembershipPowerUp_fantasyLeagueMembershipId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FantasyLeagueMembershipPowerUp" DROP CONSTRAINT "FantasyLeagueMembershipPowerUp_powerUpId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PowerUp" DROP CONSTRAINT "PowerUp_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserPowerUp" DROP CONSTRAINT "UserPowerUp_powerUpId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserPowerUp" DROP CONSTRAINT "UserPowerUp_userId_fkey";

-- AlterTable
ALTER TABLE "public"."FantasyLeague" DROP COLUMN "allowPowerUps",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "winnersArray" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "public"."AdminOtpSecret";

-- DropTable
DROP TABLE "public"."FantasyLeagueMembershipPowerUp";

-- DropTable
DROP TABLE "public"."PowerUp";

-- DropTable
DROP TABLE "public"."PowerUpCategory";

-- DropTable
DROP TABLE "public"."UserPowerUp";
