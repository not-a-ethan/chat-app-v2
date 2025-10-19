# DB docs

Has the statments to create all the tables

## `messages`

```sql
CREATE TABLE "messages" (
	"id"	INTEGER NOT NULL UNIQUE,
	"roomId"	INTEGER NOT NULL,
	"user"	INTEGER NOT NULL,
	"content"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
)
```

## `rooms`

```sql
CREATE TABLE "rooms" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"owner"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
)
```

## `users`

```sql
CREATE TABLE "users" (
	"githubID"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"pfp"	BLOB,
	"lastActivity"	INTEGER NOT NULL,
	"rooms"	TEXT,
	PRIMARY KEY("githubID")
)
```

## Other

Make sure that the auto increment IDs are working. In SQLite it needs a sepret table. If that is not automaticly created by the statments above, use the following statment:

```sql
CREATE TABLE sqlite_sequence(name,seq)
```