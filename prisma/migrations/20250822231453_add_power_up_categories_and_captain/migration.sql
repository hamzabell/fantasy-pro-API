-- AlterTable
ALTER TABLE "public"."PowerUp" ADD COLUMN     "categoryId" TEXT,
ALTER COLUMN "contractAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "captainId" INTEGER;

-- CreateTable
CREATE TABLE "public"."PowerUpCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PowerUpCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PowerUpCategory_name_key" ON "public"."PowerUpCategory"("name");

-- AddForeignKey
ALTER TABLE "public"."PowerUp" ADD CONSTRAINT "PowerUp_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."PowerUpCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
