-- CreateTable
CREATE TABLE "public"."AdminOtpSecret" (
    "userId" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "issuer" TEXT,

    CONSTRAINT "AdminOtpSecret_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "public"."AdminOtpSecret" ADD CONSTRAINT "AdminOtpSecret_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
