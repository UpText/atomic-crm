CREATE PROCEDURE [crmapi].[contact_notes_delete](
    @ID varchar(max),
    @auth_tenant NVARCHAR(255) = NULL
)
AS
BEGIN
    IF NOT EXISTS(SELECT 1 FROM crm.contact_notes WHERE id = @ID AND tenant = @auth_tenant)
    BEGIN
        RAISERROR('Unknown contact_notes', 1, 1);
        RETURN 404;
    END

    DELETE FROM crm.contact_notes
    WHERE id = @ID
      AND tenant = @auth_tenant;

    RETURN 200;
END
