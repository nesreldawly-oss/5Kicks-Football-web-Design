## 5Kicks Football Platform – MySQL Setup

**Database name:** `football_platform`  
**User:** `football_user`  
**Password:** `football_password`

These values are already configured in the Spring Boot backend in `application.properties`.

### 1. Create database and user

In MySQL, run:

```sql
SOURCE /full/path/to/database/football_platform_mysql.sql;
```

Or copy/paste the contents of `football_platform_mysql.sql` into your MySQL client and execute it.

This will:
- **Create** the `football_platform` database
- **Create** user `football_user` with password `football_password`
- **Grant** that user full permissions on the database

### 2. Table creation

You **do not need** to manually create tables.  
When you start the backend, Spring Data JPA / Hibernate will:
- Read the JPA entities (users, teams, players, stadiums, tournaments, matches, payments, chat, etc.)
- **Automatically create / update** the tables and relationships in `football_platform`

This is controlled by:

```properties
spring.jpa.hibernate.ddl-auto=update
```


