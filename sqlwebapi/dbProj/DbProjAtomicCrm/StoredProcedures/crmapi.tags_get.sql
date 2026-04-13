CREATE PROCEDURE [crmapi].[tags_get](
    @ID varchar(max) = NULL,
    @filter varchar(max) = NULL,
    @first_row INT = 0,
    @last_row INT = 1000,
    @sort_field NVARCHAR(100) = NULL,
    @sort_order NVARCHAR(4) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    SELECT id, name, color, COUNT(*) OVER() AS total_rows
    FROM crm.tags
    WHERE tenant = @auth_tenant
      AND (@ID IS NULL OR @ID = id)
      AND (
            @filter IS NULL
            OR NOT EXISTS (SELECT 1 FROM OPENJSON(@filter, '$.id'))
            OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
      )
    ORDER BY
        CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC,
        CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC,
        CASE WHEN @sort_field = 'name' AND @sort_order = 'ASC' THEN name END ASC,
        CASE WHEN @sort_field = 'name' AND @sort_order = 'DESC' THEN name END DESC,
        CASE WHEN @sort_field = 'color' AND @sort_order = 'ASC' THEN color END ASC,
        CASE WHEN @sort_field = 'color' AND @sort_order = 'DESC' THEN color END DESC,
        CASE WHEN @sort_field IS NULL THEN id END ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END
