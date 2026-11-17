-- Only the authenticated API consent completion calls this internal procedure.
CREATE PROCEDURE [crmauth].[connection_post]
    @tenant nvarchar(255), @actor int, @expectedConfig nvarchar(max),
    @directoryId uniqueidentifier, @clientId uniqueidentifier, @clientSecretUri nvarchar(2048)
AS
BEGIN
    SET NOCOUNT ON; SET XACT_ABORT ON;
    BEGIN TRANSACTION;
    IF NOT EXISTS (SELECT 1 FROM crm.sales s WITH (UPDLOCK,HOLDLOCK)
        JOIN crm.tenants t ON t.name=s.tenant AND t.active=1
        WHERE s.tenant=@tenant AND s.id=@actor AND s.disabled=0 AND s.administrator=1)
        THROW 50001, 'Tenant administrator required.', 1;
    DECLARE @config nvarchar(max), @entra nvarchar(max);
    SELECT @config=config FROM crm.configuration WITH (UPDLOCK,HOLDLOCK) WHERE tenant=@tenant AND id=1;
    IF @config IS NULL OR @config COLLATE Latin1_General_100_BIN2 <> @expectedConfig COLLATE Latin1_General_100_BIN2
        THROW 50005, 'Settings changed during consent. Restart from tenant settings.', 1;
    SET @entra=COALESCE(JSON_QUERY(@config,'$.authentication.entra'),N'{}');
    SET @entra=JSON_MODIFY(@entra,'$.enabled',CAST(1 AS bit));
    SET @entra=JSON_MODIFY(@entra,'$.directoryId',LOWER(CONVERT(nvarchar(36),@directoryId)));
    SET @entra=JSON_MODIFY(@entra,'$.clientId',LOWER(CONVERT(nvarchar(36),@clientId)));
    SET @entra=JSON_MODIFY(@entra,'$.clientSecretUri',@clientSecretUri);
    IF JSON_VALUE(@entra,'$.provisioningMode') IS NULL SET @entra=JSON_MODIFY(@entra,'$.provisioningMode','invite_only');
    IF JSON_QUERY(@config,'$.authentication') IS NULL SET @config=JSON_MODIFY(@config,'$.authentication',JSON_QUERY('{}'));
    SET @config=JSON_MODIFY(@config,'$.authentication.entra',JSON_QUERY(@entra));
    UPDATE crm.configuration SET config=@config WHERE tenant=@tenant AND id=1;
    COMMIT;
END
