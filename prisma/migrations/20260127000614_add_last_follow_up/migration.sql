-- CreateTable
CREATE TABLE "last_follow_up" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "followUpDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "contactedById" TEXT NOT NULL,
    "personContactedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "last_follow_up_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "last_follow_up" ADD CONSTRAINT "last_follow_up_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "last_follow_up" ADD CONSTRAINT "last_follow_up_contactedById_fkey" FOREIGN KEY ("contactedById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "last_follow_up" ADD CONSTRAINT "last_follow_up_personContactedId_fkey" FOREIGN KEY ("personContactedId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
