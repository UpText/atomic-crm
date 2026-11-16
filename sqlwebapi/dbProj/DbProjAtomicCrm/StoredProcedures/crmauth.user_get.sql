CREATE PROCEDURE [crmauth].[user_get]
    @tenant nvarchar(255), @id int,
    @directoryId uniqueidentifier = NULL, @objectId uniqueidentifier = NULL, @clientId uniqueidentifier = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT s.id, s.tenant, s.user_id, s.email, s.first_name, s.last_name, s.administrator, s.disabled
    FROM crm.sales s JOIN crm.tenants t ON t.name=s.tenant AND t.active=1
    WHERE s.tenant=@tenant AND s.id=@id AND s.disabled=0
      AND (@objectId IS NULL OR EXISTS (
        SELECT 1 FROM crm.external_identities e JOIN crm.configuration c ON c.tenant=e.tenant AND c.id=1
        WHERE e.tenant=s.tenant AND e.sales_id=s.id AND e.directory_id=@directoryId AND e.object_id=@objectId
          AND e.client_id=@clientId AND e.revoked_at IS NULL AND e.activated_at IS NOT NULL
          AND JSON_VALUE(c.config,'$.authentication.entra.enabled')='true'
          AND TRY_CONVERT(uniqueidentifier,JSON_VALUE(c.config,'$.authentication.entra.directoryId'))=@directoryId
          AND TRY_CONVERT(uniqueidentifier,JSON_VALUE(c.config,'$.authentication.entra.clientId'))=@clientId));
END
