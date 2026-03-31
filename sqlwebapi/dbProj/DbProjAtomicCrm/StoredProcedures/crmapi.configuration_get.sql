CREATE PROCEDURE [crmapi].[configuration_get](
    @ID varchar(max) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
)
AS
BEGIN
    SELECT id, tenant, config, updated_at, updated_by
    FROM crm.configuration
    WHERE tenant = @auth_tenant
      AND (@ID IS NULL OR @ID = id);
END
