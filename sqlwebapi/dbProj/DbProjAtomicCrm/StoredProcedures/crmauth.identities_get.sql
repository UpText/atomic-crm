CREATE PROCEDURE [crmauth].[identities_get] @tenant nvarchar(255), @actor int
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM crm.sales WHERE tenant=@tenant AND id=@actor AND disabled=0 AND administrator=1)
        THROW 50001, 'Tenant administrator required.', 1;
    SELECT e.sales_id AS id, e.object_id, e.directory_id, e.client_id, s.email, e.created_at, e.expires_at, e.activated_at, e.revoked_at
    FROM crm.external_identities e JOIN crm.sales s ON s.tenant=e.tenant AND s.id=e.sales_id
    WHERE e.tenant=@tenant ORDER BY e.created_at DESC;
END
