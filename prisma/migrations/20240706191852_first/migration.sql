-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CREATOR', 'MEMBER');

-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Organisations" (
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Organisations_pkey" PRIMARY KEY ("orgId")
);

-- CreateTable
CREATE TABLE "UserOrganisation" (
    "userId" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "UserOrganisation_pkey" PRIMARY KEY ("userId","organisationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_userId_key" ON "Users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organisations_orgId_key" ON "Organisations"("orgId");

-- AddForeignKey
ALTER TABLE "UserOrganisation" ADD CONSTRAINT "UserOrganisation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganisation" ADD CONSTRAINT "UserOrganisation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisations"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
