-- Internal auth schema is never exposed through a configured REST service.
CREATE PROCEDURE [crmauth].[configuration_get] @tenant nvarchar(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT c.config FROM crm.configuration c
    JOIN crm.tenants t ON t.name = c.tenant AND t.active = 1
    WHERE c.tenant = @tenant AND c.id = 1;
END
