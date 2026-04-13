/* 
    Run the LOGIN part in master (once per server)
    Run the rest in the target database
*/

--------------------------------------------------
-- 1. Create login (server-level)
--------------------------------------------------
USE master;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.sql_logins WHERE name = N'up-service-user'
)
BEGIN
    CREATE LOGIN [up-service-user]
        WITH PASSWORD = 'UpServiceUserStrongPassword!23';
END
GO

--------------------------------------------------
-- 2. Switch to application database
--------------------------------------------------
USE crm2 ;
GO

--------------------------------------------------
-- 3. Create schema crmapi
--------------------------------------------------
IF NOT EXISTS (
    SELECT 1 FROM sys.schemas WHERE name = N'crmapi'
)
BEGIN
    EXEC ('CREATE SCHEMA crmapi');
END
GO

--------------------------------------------------
-- 4. Create database user
--------------------------------------------------
IF NOT EXISTS (
    SELECT 1 FROM sys.database_principals WHERE name = N'up-service-user'
)
BEGIN
    CREATE USER [up-service-user]
        FOR LOGIN [up-service-user]
        WITH DEFAULT_SCHEMA = crmapi;
END
GO

--------------------------------------------------
-- 5. Grant EXECUTE on crmapi schema
--------------------------------------------------
GRANT EXECUTE ON SCHEMA::crmapi TO [up-service-user];
GO
