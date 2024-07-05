/*
  Warnings:

  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UsersOrganization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UsersOrganization" DROP CONSTRAINT "_UsersOrganization_A_fkey";

-- DropForeignKey
ALTER TABLE "_UsersOrganization" DROP CONSTRAINT "_UsersOrganization_B_fkey";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "_UsersOrganization";

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

    CONSTRAINT "UserOrganisation_pkey" PRIMARY KEY ("userId","organisationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organisations_orgId_key" ON "Organisations"("orgId");

-- AddForeignKey
ALTER TABLE "UserOrganisation" ADD CONSTRAINT "UserOrganisation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganisation" ADD CONSTRAINT "UserOrganisation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisations"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
