# productivity-api

API backend for the Productivity frontend

# Database

Until I programatically create the database, here are the SQL statements needed for the application to run:

```sql
CREATE TABLE "tags" (
	"id" TEXT NOT NULL UNIQUE,
	"name" TEXT NOT NULL,
	"color" TEXT NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "todoItems" (
    "id" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "isCompleted" INTEGER CHECK(isCompleted in ('0', '1')),
    "dateCreated" TEXT NOT NULL,
	"timeCreated" TEXT NOT NULL,
	"timezoneCreated" TEXT NOT NULL,
    "dateCompleted" TEXT,
	"timeCompleted" TEXT,
	"timezoneCompleted" TEXT,
    PRIMARY KEY("id")
);

CREATE TABLE "todoItemTags" (
	"tagId" TEXT NOT NULL,
	"todoItemId" TEXT NOT NULL,
	PRIMARY KEY("tagId", "todoItemId"),
	FOREIGN KEY("tagId") REFERENCES todoItems("id"),
	FOREIGN KEY("todoItemId") REFERENCES tags("id")
);
```
