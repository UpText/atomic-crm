CREATE PROCEDURE [crmapi].[sales_get](
    @ID varchar(max) = NULL,
    @filter varchar(max) = NULL,
    @first_row INT = 0,
    @last_row INT = 1000,
    @sort_field NVARCHAR(100) = NULL,
    @sort_order NVARCHAR(4) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    DECLARE @filter_email varchar(max) = JSON_VALUE(@filter, '$.email');

    SELECT
        id,
        user_id,
        email,
        first_name,
        last_name,
        administrator,
        disabled,
        JSON_QUERY((
            SELECT
                avatar_src AS [src],
                avatar_title AS [title],
                avatar_path AS [path],
                avatar_type AS [type]
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        )) AS avatar,
        created_at,
        updated_at,
        COUNT(*) OVER() AS total_rows
    FROM crm.sales
    WHERE tenant = @auth_tenant
      AND (@ID IS NULL OR @ID = id)
      AND (
            @filter IS NULL
            OR @filter_email IS NULL
            OR email = @filter_email
            OR NOT EXISTS (SELECT 1 FROM OPENJSON(@filter, '$.id'))
            OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
      )
      AND (@filter_email IS NULL OR email = @filter_email)
    ORDER BY
        CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC,
        CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC,
        CASE WHEN @sort_field = 'user_id' AND @sort_order = 'ASC' THEN user_id END ASC,
        CASE WHEN @sort_field = 'user_id' AND @sort_order = 'DESC' THEN user_id END DESC,
        CASE WHEN @sort_field = 'email' AND @sort_order = 'ASC' THEN email END ASC,
        CASE WHEN @sort_field = 'email' AND @sort_order = 'DESC' THEN email END DESC,
        CASE WHEN @sort_field = 'first_name' AND @sort_order = 'ASC' THEN first_name END ASC,
        CASE WHEN @sort_field = 'first_name' AND @sort_order = 'DESC' THEN first_name END DESC,
        CASE WHEN @sort_field = 'last_name' AND @sort_order = 'ASC' THEN last_name END ASC,
        CASE WHEN @sort_field = 'last_name' AND @sort_order = 'DESC' THEN last_name END DESC,
        CASE WHEN @sort_field = 'avatar_src' AND @sort_order = 'ASC' THEN avatar_src END ASC,
        CASE WHEN @sort_field = 'avatar_src' AND @sort_order = 'DESC' THEN avatar_src END DESC,
        CASE WHEN @sort_field = 'avatar_title' AND @sort_order = 'ASC' THEN avatar_title END ASC,
        CASE WHEN @sort_field = 'avatar_title' AND @sort_order = 'DESC' THEN avatar_title END DESC,
        CASE WHEN @sort_field = 'avatar_path' AND @sort_order = 'ASC' THEN avatar_path END ASC,
        CASE WHEN @sort_field = 'avatar_path' AND @sort_order = 'DESC' THEN avatar_path END DESC,
        CASE WHEN @sort_field = 'avatar_type' AND @sort_order = 'ASC' THEN avatar_type END ASC,
        CASE WHEN @sort_field = 'avatar_type' AND @sort_order = 'DESC' THEN avatar_type END DESC,
        CASE WHEN @sort_field IS NULL THEN id END ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END
