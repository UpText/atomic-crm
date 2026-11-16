CREATE PROCEDURE [crmauth].[invite_post]
    @tenant nvarchar(255), @actor int, @objectId uniqueidentifier,
    @email nvarchar(320), @firstName nvarchar(100)=NULL, @lastName nvarchar(100)=NULL, @salesId int=NULL
AS
BEGIN
    SET NOCOUNT ON; SET XACT_ABORT ON;
    IF NOT EXISTS (SELECT 1 FROM crm.sales s JOIN crm.tenants t ON t.name=s.tenant AND t.active=1
        WHERE s.tenant=@tenant AND s.id=@actor AND s.disabled=0 AND s.administrator=1)
        THROW 50001, 'Tenant administrator required.', 1;
    DECLARE @directory uniqueidentifier, @client uniqueidentifier;
    SELECT @directory=TRY_CONVERT(uniqueidentifier,JSON_VALUE(config,'$.authentication.entra.directoryId')),
        @client=TRY_CONVERT(uniqueidentifier,JSON_VALUE(config,'$.authentication.entra.clientId'))
    FROM crm.configuration WHERE tenant=@tenant AND id=1;
    IF @directory IS NULL OR @client IS NULL THROW 50002, 'Configure Entra before inviting users.', 1;
    BEGIN TRANSACTION;
    IF @salesId IS NULL
    BEGIN
        INSERT crm.sales (tenant,email,first_name,last_name,administrator,disabled)
        VALUES (@tenant,@email,@firstName,@lastName,0,0);
        SET @salesId=SCOPE_IDENTITY();
    END
    IF NOT EXISTS (SELECT 1 FROM crm.sales WHERE tenant=@tenant AND id=@salesId AND disabled=0)
        THROW 50003, 'Active CRM user not found in this tenant.', 1;
    -- Explicit administrator action; no automatic email-based identity linking.
    IF EXISTS (SELECT 1 FROM crm.external_identities WITH (UPDLOCK,HOLDLOCK)
        WHERE tenant=@tenant AND directory_id=@directory AND object_id=@objectId AND revoked_at IS NULL)
        THROW 50004, 'Identity already invited or linked. Revoke it before replacing it.', 1;
    DELETE crm.external_identities WHERE tenant=@tenant AND directory_id=@directory AND object_id=@objectId;
    INSERT crm.external_identities (tenant,directory_id,object_id,client_id,sales_id,invited_by,expires_at)
    VALUES (@tenant,@directory,@objectId,@client,@salesId,@actor,DATEADD(day,7,SYSUTCDATETIME()));
    COMMIT;
    SELECT @salesId AS id;
END
