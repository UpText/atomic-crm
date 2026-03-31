/*
    Non-contained SQL Server helper for the SqlWebApi service account.

    Usage:
    1. Replace the database name in the USE statement.
    2. Replace the password before running the script.
    3. Run the LOGIN part in master.
    4. Run the USER/GRANT part in the target database.
*/

--------------------------------------------------
-- 1. Create login (server-level)
--------------------------------------------------
USE [master];
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.sql_logins
    WHERE name = N'uptextservice'
)
BEGIN
    CREATE LOGIN [uptextservice]
        WITH PASSWORD = 'CHANGE_THIS_PASSWORD';
END
GO

--------------------------------------------------
-- 2. Switch to application database
--------------------------------------------------
USE [crm2];
GO

--------------------------------------------------
-- 3. Create database user mapped to the login
--------------------------------------------------
IF NOT EXISTS (
    SELECT 1
    FROM sys.database_principals
    WHERE name = N'uptextservice'
)
BEGIN
    CREATE USER [uptextservice]
        FOR LOGIN [uptextservice]
        WITH DEFAULT_SCHEMA = [crmapi];
END
ELSE
BEGIN
    ALTER USER [uptextservice]
        WITH DEFAULT_SCHEMA = [crmapi];
END
GO

--------------------------------------------------
-- 4. Grant execute rights to crmapi
--------------------------------------------------
GRANT EXECUTE ON SCHEMA::[crmapi] TO [uptextservice];
GO
