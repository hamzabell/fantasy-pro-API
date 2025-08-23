-- CreateTable
CREATE TABLE "public"."PowerUp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "metadataUri" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PowerUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPowerUp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "powerUpId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "isBurnt" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPowerUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FantasyLeagueMembershipPowerUp" (
    "id" TEXT NOT NULL,
    "fantasyLeagueMembershipId" TEXT NOT NULL,
    "powerUpId" TEXT NOT NULL,
    "isBurnt" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FantasyLeagueMembershipPowerUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPowerUp_userId_powerUpId_key" ON "public"."UserPowerUp"("userId", "powerUpId");

-- CreateIndex
CREATE UNIQUE INDEX "FantasyLeagueMembershipPowerUp_fantasyLeagueMembershipId_po_key" ON "public"."FantasyLeagueMembershipPowerUp"("fantasyLeagueMembershipId", "powerUpId");

-- AddForeignKey
ALTER TABLE "public"."UserPowerUp" ADD CONSTRAINT "UserPowerUp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPowerUp" ADD CONSTRAINT "UserPowerUp_powerUpId_fkey" FOREIGN KEY ("powerUpId") REFERENCES "public"."PowerUp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FantasyLeagueMembershipPowerUp" ADD CONSTRAINT "FantasyLeagueMembershipPowerUp_fantasyLeagueMembershipId_fkey" FOREIGN KEY ("fantasyLeagueMembershipId") REFERENCES "public"."FantasyLeagueMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FantasyLeagueMembershipPowerUp" ADD CONSTRAINT "FantasyLeagueMembershipPowerUp_powerUpId_fkey" FOREIGN KEY ("powerUpId") REFERENCES "public"."PowerUp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
