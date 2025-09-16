-- CreateTable
CREATE TABLE "Checkout" (
    "id" TEXT NOT NULL,
    "myCheckout" TEXT NOT NULL,
    "lastClientCheckout" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);
