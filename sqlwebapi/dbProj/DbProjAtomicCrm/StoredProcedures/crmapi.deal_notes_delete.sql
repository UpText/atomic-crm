CREATE PROCEDURE [crmapi].[deal_notes_delete](
    @ID varchar(max),
    @auth_tenant NVARCHAR(255) = NULL
)
AS
BEGIN
    IF NOT EXISTS(SELECT 1 FROM crm.deal_notes WHERE id = @ID AND tenant = @auth_tenant)
    BEGIN
        RAISERROR('Unknown deal_note', 1, 1);
        RETURN 404;
    END

    DELETE FROM crm.deal_notes
    WHERE id = @ID
      AND tenant = @auth_tenant;

    RETURN 200;
END
