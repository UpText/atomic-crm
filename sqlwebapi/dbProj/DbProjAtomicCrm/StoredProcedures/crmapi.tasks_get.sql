CREATE PROCEDURE [crmapi].[tasks_get](
    @ID varchar(max) = NULL,
    @filter varchar(max)=NULL,
    @first_row INT = 0,
    @last_row INT = 1000,
    @sort_field NVARCHAR(100) = NULL,
    @sort_order NVARCHAR(4) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    DECLARE @filter_done_date VARCHAR(100) = TRY_CONVERT(VARCHAR(100), JSON_VALUE(@filter, N'$."done_date"'), 126);
    DECLARE @contact_id_eq INT = TRY_CONVERT(INT, JSON_VALUE(@filter, N'$."contact_id"'));
    DECLARE @due_date_gte datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."due_date@gte"')));
    DECLARE @due_date_gt datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."due_date@gt"')));
    DECLARE @due_date_lte datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."due_date@lte"')));
    DECLARE @due_date_lt datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."due_date@lt"')));
    DECLARE @due_date_eq datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."due_date@eq"')));

    SELECT id, tenant, contact_id, sales_id, type, text, due_date, done_date, COUNT(*) OVER() AS total_rows
    FROM crm.tasks
    WHERE tenant = @auth_tenant
      AND (@ID IS NULL OR @ID = id)
      AND (
            @filter IS NULL
            OR NOT EXISTS (SELECT 1 FROM OPENJSON(@filter, '$.id'))
            OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
      )
      AND (@filter_done_date IS NULL OR (@filter_done_date = 'null' AND done_date IS NULL))
      AND (@contact_id_eq IS NULL OR contact_id = @contact_id_eq)
      AND (@due_date_gte IS NULL OR due_date >= @due_date_gte)
      AND (@due_date_gt IS NULL OR due_date > @due_date_gt)
      AND (@due_date_lte IS NULL OR due_date <= @due_date_lte)
      AND (@due_date_lt IS NULL OR due_date < @due_date_lt)
      AND (@due_date_eq IS NULL OR due_date = @due_date_eq)
    ORDER BY
        CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC,
        CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC,
        CASE WHEN @sort_field = 'contact_id' AND @sort_order = 'ASC' THEN contact_id END ASC,
        CASE WHEN @sort_field = 'contact_id' AND @sort_order = 'DESC' THEN contact_id END DESC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC,
        CASE WHEN @sort_field = 'type' AND @sort_order = 'ASC' THEN type END ASC,
        CASE WHEN @sort_field = 'type' AND @sort_order = 'DESC' THEN type END DESC,
        CASE WHEN @sort_field = 'text' AND @sort_order = 'ASC' THEN text END ASC,
        CASE WHEN @sort_field = 'text' AND @sort_order = 'DESC' THEN text END DESC,
        CASE WHEN @sort_field IS NULL THEN id END ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END
