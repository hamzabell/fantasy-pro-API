-- DropForeignKey
ALTER TABLE "public"."FantasyLeague" DROP CONSTRAINT "FantasyLeague_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FantasyLeagueMembership" DROP CONSTRAINT "FantasyLeagueMembership_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FantasyLeagueMembership" DROP CONSTRAINT "FantasyLeagueMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Team" DROP CONSTRAINT "Team_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FantasyLeague" ADD CONSTRAINT "FantasyLeague_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FantasyLeagueMembership" ADD CONSTRAINT "FantasyLeagueMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FantasyLeagueMembership" ADD CONSTRAINT "FantasyLeagueMembership_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."FantasyLeague"("id") ON DELETE CASCADE ON UPDATE CASCADE;
