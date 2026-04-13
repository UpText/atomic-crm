CREATE PROCEDURE [crmapi].[deal_notes_get](
    @ID varchar(max) = NULL,
    @filter varchar(max)=NULL,
    @first_row INT = 0,
    @last_row INT = 1000,
    @sort_field NVARCHAR(100) = NULL,
    @sort_order NVARCHAR(4) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    DECLARE @deal_id_eq INT = TRY_CONVERT(INT, JSON_VALUE(@filter, N'$."deal_id"'));
    DECLARE @ids_raw NVARCHAR(MAX) = JSON_VALUE(@filter, '$."deal_id@in"');

    IF @ids_raw IS NOT NULL
        SET @ids_raw = '[' + REPLACE(REPLACE(@ids_raw, '(', ''), ')', '') + ']';

    SELECT
        id,
        deal_id,
        sales_id,
        date,
        text,
        JSON_QUERY((
            SELECT
                na.id,
                na.contact_note_id,
                na.deal_note_id,
                na.src,
                na.title,
                na.[path],
                na.[type],
                na.created_at
            FROM crm.note_attachments na
            WHERE na.deal_note_id = dn.id
              AND na.tenant = @auth_tenant
            FOR JSON PATH
        )) AS attachments,
        COUNT(*) OVER() AS total_rows
    FROM crm.deal_notes dn
    WHERE dn.tenant = @auth_tenant
      AND (@ID IS NULL OR @ID = id)
      AND (@deal_id_eq IS NULL OR deal_id = @deal_id_eq)
      AND (
            @ids_raw IS NULL
            OR deal_id IN (
                SELECT TRY_CAST(value AS INT)
                FROM OPENJSON(@ids_raw)
            )
      )
    ORDER BY
        CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC,
        CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC,
        CASE WHEN @sort_field = 'deal_id' AND @sort_order = 'ASC' THEN deal_id END ASC,
        CASE WHEN @sort_field = 'deal_id' AND @sort_order = 'DESC' THEN deal_id END DESC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC,
        CASE WHEN @sort_field = 'date' AND @sort_order = 'ASC' THEN [date] END ASC,
        CASE WHEN @sort_field = 'date' AND @sort_order = 'DESC' THEN [date] END DESC,
        CASE WHEN @sort_field IS NULL THEN id END ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END
