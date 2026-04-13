CREATE PROCEDURE [crmapi].[tenants_put](
    @ID varchar(max),
    @display_name NVARCHAR(255) = NULL,
    @active BIT = NULL,
    @auth_tenant NVARCHAR(255) = NULL
)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM crm.tenants WHERE name = @ID)
    BEGIN
        RAISERROR('Unknown tenant.', 16, 1);
        RETURN 404;
    END

    UPDATE crm.tenants
    SET display_name = COALESCE(NULLIF(LTRIM(RTRIM(@display_name)), N''), display_name),
        active = COALESCE(@active, active),
        activated_at = CASE
            WHEN @active = 1 AND active = 0 THEN SYSUTCDATETIME()
            ELSE activated_at
        END,
        deactivated_at = CASE
            WHEN @active = 0 AND active = 1 THEN SYSUTCDATETIME()
            WHEN @active = 1 AND active = 0 THEN NULL
            ELSE deactivated_at
        END
    WHERE name = @ID;

    EXEC crmapi.tenants_get @ID = @ID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
