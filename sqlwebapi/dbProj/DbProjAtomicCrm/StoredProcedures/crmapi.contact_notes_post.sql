CREATE PROCEDURE [crmapi].[contact_notes_post](
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

    IF @sales_id IS NULL OR @sales_id = 0
    BEGIN
        SELECT TOP 1 @sales_id = id
        FROM crm.sales
        WHERE tenant = @auth_tenant
        ORDER BY id;
    END

    INSERT INTO crm.contact_notes (tenant, contact_id, sales_id, [date], [text], [status])
    VALUES (@auth_tenant, @contact_id, @sales_id, @date, @text, @status);

    DECLARE @NEWID INT = CAST(SCOPE_IDENTITY() AS INT);

    IF @attachments IS NOT NULL AND ISJSON(@attachments) = 1
    BEGIN
        INSERT INTO crm.note_attachments (tenant, contact_note_id, deal_note_id, src, title, path, [type], created_at)
        SELECT
            @auth_tenant,
            @NEWID,
            NULL,
            j.src,
            j.title,
            j.path,
            j.[type],
            SYSUTCDATETIME()
        FROM OPENJSON(@attachments)
        WITH (
            src NVARCHAR(1000) '$.src',
            title NVARCHAR(255) '$.title',
            path NVARCHAR(255) '$.path',
            [type] NVARCHAR(100) '$.type'
        ) AS j;
    END;

    EXEC crmapi.contact_notes_Get @ID = @NEWID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
