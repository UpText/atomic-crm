CREATE PROCEDURE [crmapi].[configuration_put](
    @ID varchar(max) = NULL,
    @config NVARCHAR(MAX),
    @auth_email VARCHAR(MAX),
    @auth_tenant NVARCHAR(255)
)
AS
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM crm.configuration
        WHERE id = @ID
          AND tenant = @auth_tenant
    )
    BEGIN
        RAISERROR('Configuration with specified ID does not exist.', 16, 1);
        RETURN 400;
    END

    UPDATE crm.configuration
    SET config = @config,
        updated_at = SYSUTCDATETIME(),
        updated_by = @auth_email
    WHERE id = @ID
      AND tenant = @auth_tenant;

    SELECT id, tenant, config, updated_at, updated_by
    FROM crm.configuration
    WHERE id = @ID
      AND tenant = @auth_tenant;
END
