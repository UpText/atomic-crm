CREATE PROCEDURE [crmapi].[tenants_get](
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
    DECLARE @search NVARCHAR(200) = TRY_CONVERT(NVARCHAR(200), JSON_VALUE(@filter, '$.q'));

    SELECT
        t.name AS id,
        t.name,
        t.display_name,
        t.active,
        t.activated_at,
        t.deactivated_at,
        t.created_at,
        admin.email AS admin_email,
        COUNT(*) OVER() AS total_rows
    FROM crm.tenants t
    OUTER APPLY (
        SELECT TOP 1 s.email
        FROM crm.sales s
        WHERE s.tenant = t.name
          AND s.user_id = N'admin'
        ORDER BY s.id
    ) admin
    WHERE (@ID IS NULL OR t.name = @ID)
      AND (
            @filter IS NULL
            OR @search IS NULL
            OR t.name LIKE '%' + @search + '%'
            OR t.display_name LIKE '%' + @search + '%'
            OR admin.email LIKE '%' + @search + '%'
      )
    ORDER BY
        CASE WHEN @sort_field = 'name' AND @sort_order = 'ASC' THEN t.name END ASC,
        CASE WHEN @sort_field = 'name' AND @sort_order = 'DESC' THEN t.name END DESC,
        CASE WHEN @sort_field = 'display_name' AND @sort_order = 'ASC' THEN t.display_name END ASC,
        CASE WHEN @sort_field = 'display_name' AND @sort_order = 'DESC' THEN t.display_name END DESC,
        CASE WHEN @sort_field = 'active' AND @sort_order = 'ASC' THEN t.active END ASC,
        CASE WHEN @sort_field = 'active' AND @sort_order = 'DESC' THEN t.active END DESC,
        CASE WHEN @sort_field = 'created_at' AND @sort_order = 'ASC' THEN t.created_at END ASC,
        CASE WHEN @sort_field = 'created_at' AND @sort_order = 'DESC' THEN t.created_at END DESC,
        CASE WHEN @sort_field IS NULL THEN t.name END ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END
