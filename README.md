# productivity-api

API backend for the Productivity frontend

# Database

Until I programatically create the database, here are the SQL statements needed for the application to run:

```sql
CREATE TABLE "todo_items" (
    "id"	TEXT NOT NULL UNIQUE,
    "title"	TEXT NOT NULL,
    "description"	TEXT,
    "notes"	TEXT,
    "is_completed"	INTEGER CHECK(is_completed in ('0', '1')),
    "date_created"	TEXT NOT NULL,
    "date_completed"	TEXT,
    PRIMARY KEY("id")
);
```
