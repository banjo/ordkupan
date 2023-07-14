-- CreateTable
CREATE TABLE "Guess" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "guesses" INTEGER NOT NULL,
    "words" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
