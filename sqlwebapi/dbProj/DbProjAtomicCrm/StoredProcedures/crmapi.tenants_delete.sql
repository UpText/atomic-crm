CREATE PROCEDURE [crmapi].[tenants_delete](
    @ID varchar(max),
    @auth_tenant NVARCHAR(255) = NULL
)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM crm.tenants WHERE name = @ID)
    BEGIN
        RAISERROR('Unknown tenant.', 16, 1);
        RETURN 404;
    END

    IF EXISTS (SELECT 1 FROM crm.tenants WHERE name = @ID AND active = 1)
    BEGIN
        RAISERROR('Tenant must be deactivated before it can be deleted.', 16, 1);
        RETURN 409;
    END

    BEGIN TRANSACTION;

    DELETE FROM crm.activities WHERE tenant = @ID;
    DELETE FROM crm.note_attachments WHERE tenant = @ID;
    DELETE FROM crm.contact_tags WHERE tenant = @ID;
    DELETE FROM crm.deal_contacts WHERE tenant = @ID;
    DELETE FROM crm.tasks WHERE tenant = @ID;
    DELETE FROM crm.contact_notes WHERE tenant = @ID;
    DELETE FROM crm.deal_notes WHERE tenant = @ID;
    DELETE FROM crm.deals WHERE tenant = @ID;
    DELETE FROM crm.contacts WHERE tenant = @ID;
    DELETE FROM crm.companies WHERE tenant = @ID;
    DELETE FROM crm.tags WHERE tenant = @ID;
    DELETE FROM crm.objects WHERE tenant = @ID;
    DELETE FROM crm.buckets WHERE tenant = @ID;
    DELETE FROM crm.sales WHERE tenant = @ID;
    DELETE FROM crm.configuration WHERE tenant = @ID;
    DELETE FROM crm.tenants WHERE name = @ID;

    COMMIT TRANSACTION;

    RETURN 204;
END
