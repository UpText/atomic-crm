CREATE PROCEDURE [crmapi].[contact_notes_put](
    @ID VARCHAR(MAX),
    @contact_id INT = NULL,
    @sales_id INT = NULL,
    @date DATETIME2 = NULL,
    @text NVARCHAR(MAX) = NULL,
    @status NVARCHAR(50) = NULL,
    @attachments NVARCHAR(MAX) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @id_int INT = TRY_CONVERT(INT, @ID);

    BEGIN TRY
        IF @id_int IS NULL
        BEGIN
            RAISERROR('Invalid contact_notes id', 16, 1);
            RETURN 400;
        END

        IF NOT EXISTS (SELECT 1 FROM crm.contact_notes WHERE id = @id_int AND tenant = @auth_tenant)
        BEGIN
            RAISERROR('Unknown contact_notes', 16, 1);
            RETURN 404;
        END

        IF @attachments IS NOT NULL AND ISJSON(@attachments) <> 1
        BEGIN
            RAISERROR('attachments must be valid JSON', 16, 1);
            RETURN 400;
        END

        BEGIN TRANSACTION;

        UPDATE crm.contact_notes
        SET contact_id = COALESCE(@contact_id, contact_id),
            sales_id = COALESCE(@sales_id, sales_id),
            [date] = COALESCE(@date, [date]),
            [text] = COALESCE(@text, [text]),
            [status] = COALESCE(@status, [status])
        WHERE id = @id_int
          AND tenant = @auth_tenant;

        IF @attachments IS NOT NULL
        BEGIN
            DELETE FROM crm.note_attachments
            WHERE contact_note_id = @id_int
              AND tenant = @auth_tenant;

            INSERT INTO crm.note_attachments (tenant, contact_note_id, deal_note_id, src, title, [path], [type], created_at)
            SELECT
                @auth_tenant,
                @id_int,
                NULL,
                j.src,
                j.title,
                j.[path],
                j.[type],
                SYSUTCDATETIME()
            FROM OPENJSON(@attachments)
            WITH (
                src NVARCHAR(1000) '$.src',
                title NVARCHAR(255) '$.title',
                [path] NVARCHAR(255) '$.path',
                [type] NVARCHAR(100) '$.type'
            ) AS j;
        END

        COMMIT TRANSACTION;

        EXEC crmapi.contact_notes_Get @ID = @ID, @auth_tenant = @auth_tenant;
        RETURN 200;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END
