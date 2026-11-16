CREATE PROCEDURE [crmapi].[configuration_put](
    @ID varchar(max) = NULL,
    @config nvarchar(max),
    @auth_email varchar(max),
    @auth_id int,
    @auth_tenant nvarchar(255)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 FROM crm.sales s
        JOIN crm.tenants t ON t.name = s.tenant AND t.active = 1
        WHERE s.tenant = @auth_tenant AND s.id = @auth_id
          AND s.administrator = 1 AND s.disabled = 0
    )
    BEGIN
        SELECT N'An active administrator with access to this tenant is required.' AS message;
        RETURN 403;
    END;

    IF ISJSON(@config) <> 1 OR @config IS NULL
    BEGIN
        SELECT N'Configuration must contain valid JSON.' AS message;
        RETURN 400;
    END;
    IF JSON_VALUE(@config, '$.authentication.entra.provisioningMode') IS NOT NULL
        AND JSON_VALUE(@config, '$.authentication.entra.provisioningMode') NOT IN ('invite_only', 'automatic')
    BEGIN
        SELECT N'Invalid Entra provisioning mode.' AS message;
        RETURN 400;
    END;

    DECLARE @configuration_id int = TRY_CONVERT(int, @ID);
    IF @configuration_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM crm.configuration WHERE id = @configuration_id AND tenant = @auth_tenant
    )
    BEGIN
        SELECT N'Configuration with specified ID does not exist in this tenant.' AS message;
        RETURN 400;
    END;

    -- Authorize the write itself against current membership and tenant state.
    -- Hold those checks until the statement commits if roles/state change concurrently.
    UPDATE c
    SET config = @config,
        updated_at = SYSUTCDATETIME(),
        updated_by = LEFT(COALESCE(s.email, CONVERT(nvarchar(20), s.id)), 256)
    FROM crm.configuration c
    JOIN crm.sales s WITH (HOLDLOCK)
      ON s.tenant = c.tenant AND s.id = @auth_id AND s.administrator = 1 AND s.disabled = 0
    JOIN crm.tenants t WITH (HOLDLOCK) ON t.name = c.tenant AND t.active = 1
    WHERE c.id = @configuration_id AND c.tenant = @auth_tenant;

    IF @@ROWCOUNT = 0
    BEGIN
        SELECT N'Access to this tenant is no longer available.' AS message;
        RETURN 403;
    END;

    SELECT id, tenant, config, updated_at, updated_by
    FROM crm.configuration WHERE id = @configuration_id AND tenant = @auth_tenant;
    RETURN 200;
END
