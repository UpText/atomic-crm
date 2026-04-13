IF NOT EXISTS (
    SELECT 1
    FROM [crm].[tenants]
    WHERE [name] = N'default'
)
BEGIN
    INSERT INTO [crm].[tenants] ([name], [display_name])
    VALUES (N'default', N'Default');
END;

IF NOT EXISTS (
    SELECT 1
    FROM [crm].[tenants]
    WHERE [name] = N'admin'
)
BEGIN
    INSERT INTO [crm].[tenants] ([name], [display_name])
    VALUES (N'admin', N'Admin');
END;

IF NOT EXISTS (
    SELECT 1
    FROM [crm].[buckets]
    WHERE [tenant] = N'default'
      AND [bucket_id] = N'attachments'
)
BEGIN
    INSERT INTO [crm].[buckets] ([tenant], [bucket_id], [is_public])
    VALUES (N'default', N'attachments', 0);
END;

IF NOT EXISTS (
    SELECT 1
    FROM [crm].[buckets]
    WHERE [tenant] = N'admin'
      AND [bucket_id] = N'attachments'
)
BEGIN
    INSERT INTO [crm].[buckets] ([tenant], [bucket_id], [is_public])
    VALUES (N'admin', N'attachments', 0);
END;

IF NOT EXISTS (
    SELECT 1
    FROM [crm].[configuration]
    WHERE [tenant] = N'default'
      AND [id] = 1
)
BEGIN
    INSERT INTO [crm].[configuration] ([tenant], [id], [config], [updated_by])
    VALUES (N'default', 1, N'{}', N'system');
END;

IF NOT EXISTS (
    SELECT 1
    FROM [crm].[configuration]
    WHERE [tenant] = N'admin'
      AND [id] = 1
)
BEGIN
    INSERT INTO [crm].[configuration] ([tenant], [id], [config], [updated_by])
    SELECT
        N'admin',
        [id],
        JSON_MODIFY([config], '$.title', N'Admin CRM'),
        N'system'
    FROM [crm].[configuration]
    WHERE [tenant] = N'default'
      AND [id] = 1;
END;

INSERT INTO [crm].[schema_deployments]
(
    [version],
    [git_commit],
    [deployed_by],
    [deployment_target]
)
VALUES
(
    COALESCE(NULLIF('$(DeployVersion)', ''), 'manual'),
    NULLIF('$(GitCommit)', ''),
    COALESCE(NULLIF('$(DeployedBy)', ''), SUSER_SNAME()),
    COALESCE(NULLIF('$(DeploymentTarget)', ''), DB_NAME())
);

IF NULLIF('$(ServiceUserName)', '') IS NOT NULL
BEGIN
    DECLARE @service_user_name SYSNAME = '$(ServiceUserName)';
    DECLARE @service_user_password NVARCHAR(256) = '$(ServiceUserPassword)';
    DECLARE @service_user_sql NVARCHAR(MAX);
    DECLARE @database_containment TINYINT;

    SELECT @database_containment = d.containment
    FROM sys.databases AS d
    WHERE d.name = DB_NAME();

    IF NOT EXISTS (
        SELECT 1
        FROM sys.database_principals
        WHERE name = @service_user_name
    )
    BEGIN
        IF NULLIF(@service_user_password, '') IS NOT NULL AND ISNULL(@database_containment, 0) <> 0
        BEGIN
            SET @service_user_sql =
                N'CREATE USER ' + QUOTENAME(@service_user_name) +
                N' WITH PASSWORD = ' + QUOTENAME(REPLACE(@service_user_password, '''', ''''''), '''') +
                N', DEFAULT_SCHEMA = [crmapi];';

            EXEC (@service_user_sql);
        END
        ELSE
        BEGIN
            RAISERROR(
                'Skipping contained user creation for %s. The database is not contained or no password was provided. Create the database user separately, then rerun deployment to grant EXECUTE on crmapi.',
                10,
                1,
                @service_user_name
            );
        END;
    END
    ELSE
    BEGIN
        SET @service_user_sql =
            N'ALTER USER ' + QUOTENAME(@service_user_name) +
            N' WITH DEFAULT_SCHEMA = [crmapi];';

        EXEC (@service_user_sql);
    END;

    IF EXISTS (
        SELECT 1
        FROM sys.database_principals
        WHERE name = @service_user_name
    )
    BEGIN
        SET @service_user_sql =
            N'GRANT EXECUTE ON SCHEMA::[crmapi] TO ' + QUOTENAME(@service_user_name) + N';';

        EXEC (@service_user_sql);
    END;
END;
