# productivity-api

API backend for the Productivity frontend

# Database

Until I programatically create the database, here are the SQL statements needed for the application to run:

```sql
CREATE TABLE "users" (
	"id" TEXT NOT NULL UNIQUE,
	"uid" TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id")
);

CREATE TABLE "tags" (
	"id" TEXT NOT NULL UNIQUE,
	"userId" TEXT NOT NULL,
	"name" TEXT NOT NULL,
	"color" TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("userId") REFERENCES users("id")
);

CREATE TABLE "todoItems" (
    "id" TEXT NOT NULL UNIQUE,
	"userId" TEXT NOT NULL,
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
    PRIMARY KEY("id"),
	FOREIGN KEY("userId") REFERENCES users("id")
);

CREATE TABLE "todoItemTags" (
	"tagId" TEXT NOT NULL,
	"todoItemId" TEXT NOT NULL,
	PRIMARY KEY("tagId", "todoItemId"),
	FOREIGN KEY("todoItemId") REFERENCES todoItems("id"),
	FOREIGN KEY("tagId") REFERENCES tags("id")
);
```
