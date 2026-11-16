CREATE PROCEDURE [crmauth].[login_resolve]
    @tenant nvarchar(255), @directoryId uniqueidentifier, @clientId uniqueidentifier, @objectId uniqueidentifier,
    @email nvarchar(320)=NULL, @firstName nvarchar(100)=NULL, @lastName nvarchar(100)=NULL
AS
BEGIN
    SET NOCOUNT ON; SET XACT_ABORT ON;
    SET @firstName=NULLIF(LTRIM(RTRIM(@firstName)),N'');
    SET @lastName=NULLIF(LTRIM(RTRIM(@lastName)),N'');
    BEGIN TRANSACTION;
    DECLARE @config nvarchar(max), @salesId int;
    SELECT @config=c.config FROM crm.configuration c WITH (UPDLOCK,HOLDLOCK)
    JOIN crm.tenants t WITH (HOLDLOCK) ON t.name=c.tenant AND t.active=1 WHERE c.tenant=@tenant AND c.id=1;
    IF @config IS NULL OR ISNULL(JSON_VALUE(@config,'$.authentication.entra.enabled'),'false')<>'true'
        OR TRY_CONVERT(uniqueidentifier,JSON_VALUE(@config,'$.authentication.entra.directoryId')) IS NULL
        OR TRY_CONVERT(uniqueidentifier,JSON_VALUE(@config,'$.authentication.entra.clientId')) IS NULL
        OR TRY_CONVERT(uniqueidentifier,JSON_VALUE(@config,'$.authentication.entra.directoryId'))<>@directoryId
        OR TRY_CONVERT(uniqueidentifier,JSON_VALUE(@config,'$.authentication.entra.clientId'))<>@clientId
        THROW 50005, 'Entra configuration changed or is disabled.', 1;
    SELECT @salesId=sales_id FROM crm.external_identities WITH (UPDLOCK,HOLDLOCK)
    WHERE tenant=@tenant AND directory_id=@directoryId AND object_id=@objectId AND client_id=@clientId
      AND revoked_at IS NULL AND (activated_at IS NOT NULL OR expires_at>SYSUTCDATETIME());
    IF @salesId IS NULL
    BEGIN
        -- Existing/expired/revoked bindings never become automatic invitations.
        IF ISNULL(JSON_VALUE(@config,'$.authentication.entra.provisioningMode'),'invite_only')<>'automatic'
            OR EXISTS (SELECT 1 FROM crm.external_identities WHERE tenant=@tenant AND directory_id=@directoryId AND object_id=@objectId)
            THROW 50006, 'Contact your administrator to request access.', 1;
        IF NULLIF(@email,'') IS NULL THROW 50007, 'An administrator must invite this identity.', 1;
        IF EXISTS (SELECT 1 FROM crm.sales WHERE tenant=@tenant AND email=@email)
            THROW 50007, 'An administrator must explicitly link your existing CRM account.', 1;
        INSERT crm.sales (tenant,email,first_name,last_name,administrator,disabled)
        VALUES (@tenant,@email,@firstName,@lastName,0,0);
        SET @salesId=SCOPE_IDENTITY();
        INSERT crm.external_identities (tenant,directory_id,object_id,client_id,sales_id,expires_at,activated_at)
        VALUES (@tenant,@directoryId,@objectId,@clientId,@salesId,SYSUTCDATETIME(),SYSUTCDATETIME());
    END
    IF NOT EXISTS (SELECT 1 FROM crm.sales WHERE tenant=@tenant AND id=@salesId AND disabled=0)
        THROW 50008, 'Account is disabled.', 1;
    -- Populate missing profile details for invited users and older Entra-created accounts.
    -- Never overwrite names explicitly maintained in CRM.
    UPDATE crm.sales
    SET first_name=CASE WHEN NULLIF(LTRIM(RTRIM(first_name)),N'') IS NULL THEN @firstName ELSE first_name END,
        last_name=CASE WHEN NULLIF(LTRIM(RTRIM(last_name)),N'') IS NULL THEN @lastName ELSE last_name END,
        updated_at=SYSUTCDATETIME()
    WHERE tenant=@tenant AND id=@salesId
      AND ((NULLIF(LTRIM(RTRIM(first_name)),N'') IS NULL AND @firstName IS NOT NULL)
        OR (NULLIF(LTRIM(RTRIM(last_name)),N'') IS NULL AND @lastName IS NOT NULL));
    UPDATE crm.external_identities SET activated_at=COALESCE(activated_at,SYSUTCDATETIME())
    WHERE tenant=@tenant AND directory_id=@directoryId AND object_id=@objectId;
    COMMIT;
    EXEC crmauth.user_get @tenant=@tenant,@id=@salesId,@directoryId=@directoryId,@objectId=@objectId,@clientId=@clientId;
END
