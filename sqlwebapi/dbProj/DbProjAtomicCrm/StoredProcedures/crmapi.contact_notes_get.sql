CREATE PROCEDURE [crmapi].[contact_notes_Get](
    @ID varchar(max) = NULL,
    @filter varchar(max) = NULL,
    @first_row INT = 0,
    @last_row INT = 1000,
    @sort_field NVARCHAR(100) = NULL,
    @sort_order NVARCHAR(4) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_int INT = TRY_CONVERT(INT, @ID);
    DECLARE @contact_id_eq INT = TRY_CONVERT(INT, JSON_VALUE(@filter, N'$."contact_id"'));
    DECLARE @ids_raw NVARCHAR(MAX) = JSON_VALUE(@filter, '$."contact_id@in"');

    IF @ids_raw IS NOT NULL
        SET @ids_raw = '[' + REPLACE(REPLACE(@ids_raw, '(', ''), ')', '') + ']';

    SELECT
        cn.id,
        cn.contact_id,
        cn.sales_id,
        cn.[date],
        cn.[text],
        cn.[status],
        JSON_QUERY((
            SELECT
                na.id,
                na.contact_note_id,
                na.deal_note_id,
                SUBSTRING(
                    na.src,
                    CHARINDEX('/', na.src, CHARINDEX('//', na.src) + 2),
                    LEN(na.src)
                ) src,
                na.title,
                na.[path],
                na.[type],
                na.created_at
            FROM crm.note_attachments na
            WHERE na.contact_note_id = cn.id
              AND na.tenant = @auth_tenant
            FOR JSON PATH
        )) AS attachments,
        COUNT(*) OVER() AS total_rows
    FROM crm.contact_notes cn
    WHERE cn.tenant = @auth_tenant
      AND (@id_int IS NULL OR cn.id = @id_int)
      AND (@contact_id_eq IS NULL OR cn.contact_id = @contact_id_eq)
      AND (
            @ids_raw IS NULL
            OR cn.contact_id IN (
                SELECT TRY_CAST([value] AS INT)
                FROM OPENJSON(@ids_raw)
            )
      )
    ORDER BY
        CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN cn.id END ASC,
        CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN cn.id END DESC,
        CASE WHEN @sort_field = 'contact_id' AND @sort_order = 'ASC' THEN cn.contact_id END ASC,
        CASE WHEN @sort_field = 'contact_id' AND @sort_order = 'DESC' THEN cn.contact_id END DESC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN cn.sales_id END ASC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN cn.sales_id END DESC,
        CASE WHEN @sort_field = 'text' AND @sort_order = 'ASC' THEN cn.[text] END ASC,
        CASE WHEN @sort_field = 'text' AND @sort_order = 'DESC' THEN cn.[text] END DESC,
        CASE WHEN @sort_field = 'status' AND @sort_order = 'ASC' THEN cn.[status] END ASC,
        CASE WHEN @sort_field = 'status' AND @sort_order = 'DESC' THEN cn.[status] END DESC,
        CASE WHEN @sort_field = 'date' AND @sort_order = 'ASC' THEN cn.[date] END ASC,
        CASE WHEN @sort_field = 'date' AND @sort_order = 'DESC' THEN cn.[date] END DESC,
        CASE WHEN @sort_field IS NULL THEN cn.id END ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END
