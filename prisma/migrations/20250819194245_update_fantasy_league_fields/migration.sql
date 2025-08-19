/*
  Warnings:

  - Added the required column `allowPowerUps` to the `FantasyLeague` table without a default value. This is not possible if the table is not empty.
  - Added the required column `draftDate` to the `FantasyLeague` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leagueMode` to the `FantasyLeague` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leagueType` to the `FantasyLeague` table without a default value. This is not possible if the table is not empty.
  - Added the required column `limit` to the `FantasyLeague` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stake` to the `FantasyLeague` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winners` to the `FantasyLeague` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."FantasyLeague" ADD COLUMN     "allowPowerUps" BOOLEAN NOT NULL,
ADD COLUMN     "draftDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "leagueMode" TEXT NOT NULL,
ADD COLUMN     "leagueType" TEXT NOT NULL,
ADD COLUMN     "limit" INTEGER NOT NULL,
ADD COLUMN     "stake" TEXT NOT NULL,
ADD COLUMN     "winners" INTEGER NOT NULL;
