CREATE PROCEDURE [crmapi].[contacts_delete](
    @ID varchar(max) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    IF @ID IS NULL
    BEGIN
        RAISERROR('ID parameter is required', 16, 1);
        RETURN 400;
    END

    IF NOT EXISTS(SELECT 1 FROM crm.contacts WHERE id = @ID AND tenant = @auth_tenant)
    BEGIN
        RAISERROR('Unknown contacts', 1, 1);
        RETURN 404;
    END

    UPDATE crm.activities
    SET contact_id = CASE WHEN contact_id = @ID THEN NULL ELSE contact_id END,
        contact_note_id = CASE
            WHEN contact_note_id IN (
                SELECT id
                FROM crm.contact_notes
                WHERE contact_id = @ID
                  AND tenant = @auth_tenant
            ) THEN NULL
            ELSE contact_note_id
        END
    WHERE tenant = @auth_tenant
      AND (
          contact_id = @ID
          OR contact_note_id IN (
              SELECT id
              FROM crm.contact_notes
              WHERE contact_id = @ID
                AND tenant = @auth_tenant
          )
      );

    DELETE FROM crm.contacts
    WHERE id = @ID
      AND tenant = @auth_tenant;

    RETURN 204;
END
