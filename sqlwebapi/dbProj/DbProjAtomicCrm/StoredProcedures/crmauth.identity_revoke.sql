CREATE PROCEDURE [crmauth].[identity_revoke] @tenant nvarchar(255), @actor int, @objectId uniqueidentifier, @directoryId uniqueidentifier
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM crm.sales WHERE tenant=@tenant AND id=@actor AND disabled=0 AND administrator=1)
        THROW 50001, 'Tenant administrator required.', 1;
    UPDATE crm.external_identities SET revoked_at=SYSUTCDATETIME()
    WHERE tenant=@tenant AND object_id=@objectId AND directory_id=@directoryId AND revoked_at IS NULL;
END
