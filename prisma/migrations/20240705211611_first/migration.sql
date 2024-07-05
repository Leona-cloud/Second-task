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
CREATE TABLE "Organization" (
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("orgId")
);

-- CreateTable
CREATE TABLE "_UsersOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_userId_key" ON "Users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgId_key" ON "Organization"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "_UsersOrganization_AB_unique" ON "_UsersOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersOrganization_B_index" ON "_UsersOrganization"("B");

-- AddForeignKey
ALTER TABLE "_UsersOrganization" ADD CONSTRAINT "_UsersOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("orgId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersOrganization" ADD CONSTRAINT "_UsersOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
