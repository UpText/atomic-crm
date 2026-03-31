CREATE PROCEDURE [crmapi].[deals_get](
    @ID varchar(max) = NULL,
    @filter varchar(max)=NULL,
    @first_row INT = 0,
    @last_row INT = 1000,
    @sort_field NVARCHAR(100) = NULL,
    @sort_order NVARCHAR(4) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    DECLARE @archived_at_not_null bit = 0;
    DECLARE @filter_company_id int = JSON_VALUE(@filter, '$."company_id"');
    DECLARE @filter_category varchar(255) = JSON_VALUE(@filter, '$."category"');

    IF JSON_VALUE(@filter, '$."archived_at@not.is"') = 'null'
        SET @archived_at_not_null = 1;

    SELECT
        id,
        tenant,
        name,
        company_id,
        category,
        stage,
        description,
        amount,
        created_at,
        updated_at,
        archived_at,
        CONVERT(varchar(10), expected_closing_date, 23) AS expected_closing_date,
        sales_id,
        [index],
        COUNT(*) OVER() AS total_rows
    FROM crm.deals
    WHERE tenant = @auth_tenant
      AND (@ID IS NULL OR @ID = id)
      AND (@archived_at_not_null = 0 OR archived_at IS NOT NULL)
      AND (@filter_company_id IS NULL OR @filter_company_id = company_id)
      AND (@filter_category IS NULL OR @filter_category = category)
    ORDER BY
        CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC,
        CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC,
        CASE WHEN @sort_field = 'name' AND @sort_order = 'ASC' THEN name END ASC,
        CASE WHEN @sort_field = 'name' AND @sort_order = 'DESC' THEN name END DESC,
        CASE WHEN @sort_field = 'company_id' AND @sort_order = 'ASC' THEN company_id END ASC,
        CASE WHEN @sort_field = 'company_id' AND @sort_order = 'DESC' THEN company_id END DESC,
        CASE WHEN @sort_field = 'category' AND @sort_order = 'ASC' THEN category END ASC,
        CASE WHEN @sort_field = 'category' AND @sort_order = 'DESC' THEN category END DESC,
        CASE WHEN @sort_field = 'stage' AND @sort_order = 'ASC' THEN stage END ASC,
        CASE WHEN @sort_field = 'stage' AND @sort_order = 'DESC' THEN stage END DESC,
        CASE WHEN @sort_field = 'description' AND @sort_order = 'ASC' THEN description END ASC,
        CASE WHEN @sort_field = 'description' AND @sort_order = 'DESC' THEN description END DESC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC,
        CASE WHEN @sort_field = 'index' AND @sort_order = 'ASC' THEN [index] END ASC,
        CASE WHEN @sort_field = 'index' AND @sort_order = 'DESC' THEN [index] END DESC,
        CASE WHEN @sort_field IS NULL THEN id END ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END
