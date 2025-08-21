/*
  Warnings:

  - You are about to drop the column `draftDate` on the `FantasyLeague` table. All the data in the column will be lost.
  - Added the required column `gameweekId` to the `FantasyLeague` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."FantasyLeague" DROP COLUMN "draftDate",
ADD COLUMN     "gameweekId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Gameweek" (
    "id" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Gameweek_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FantasyLeague" ADD CONSTRAINT "FantasyLeague_gameweekId_fkey" FOREIGN KEY ("gameweekId") REFERENCES "public"."Gameweek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
