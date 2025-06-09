-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prod_name" TEXT,
    "description" TEXT NOT NULL,
    "price" REAL,
    "pick_up" TEXT,
    "city" TEXT,
    "category" TEXT NOT NULL DEFAULT 'fashion',
    "status" TEXT NOT NULL DEFAULT 'available',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("category", "city", "createdAt", "description", "id", "pick_up", "price", "prod_name", "updatedAt", "userId") SELECT "category", "city", "createdAt", "description", "id", "pick_up", "price", "prod_name", "updatedAt", "userId" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
