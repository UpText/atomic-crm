CREATE PROCEDURE [crmapi].[companies_Get](
    @ID varchar(max) = NULL,
    @filter varchar(max)=NULL,
    @first_row INT = 0,
    @last_row INT = 1000,
    @sort_field NVARCHAR(100) = NULL,
    @sort_order NVARCHAR(4) = NULL,
    @auth_email NVARCHAR(255) = NULL,
    @auth_baseurl NVARCHAR(255) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM crm.sales WHERE email = @auth_email AND tenant = @auth_tenant)
    BEGIN
        RAISERROR('Unauthorized', 16, 1);
        RETURN 401;
    END

    DECLARE @ids_raw NVARCHAR(MAX) = JSON_VALUE(@filter, '$."id"');

    SELECT
        id,
        name,
        sector,
        size,
        linkedin_url,
        website,
        phone_number,
        address,
        zipcode,
        city,
        state_abbr,
        country,
        description,
        revenue,
        tax_identifier,
        created_at,
        sales_id,
        JSON_QUERY((
            SELECT
                @auth_baseurl +
                SUBSTRING(
                    logo_src,
                    CHARINDEX('/', logo_src, CHARINDEX('//', logo_src) + 2),
                    LEN(logo_src)
                ) AS [src],
                logo_title AS [title],
                logo_path AS [path],
                logo_type AS [type]
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        )) AS logo,
        context_links,
        COUNT(*) OVER() AS total_rows
    FROM crm.companies
    WHERE tenant = @auth_tenant
      AND (@ID IS NULL OR @ID = id)
      AND (
            @filter IS NULL
            OR NOT EXISTS (SELECT 1 FROM OPENJSON(@filter, '$.id'))
            OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
      )
      AND (@ids_raw IS NULL OR @ids_raw = id)
    ORDER BY
        CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC,
        CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC,
        CASE WHEN @sort_field = 'name' AND @sort_order = 'ASC' THEN name END ASC,
        CASE WHEN @sort_field = 'name' AND @sort_order = 'DESC' THEN name END DESC,
        CASE WHEN @sort_field = 'sector' AND @sort_order = 'ASC' THEN sector END ASC,
        CASE WHEN @sort_field = 'sector' AND @sort_order = 'DESC' THEN sector END DESC,
        CASE WHEN @sort_field = 'size' AND @sort_order = 'ASC' THEN size END ASC,
        CASE WHEN @sort_field = 'size' AND @sort_order = 'DESC' THEN size END DESC,
        CASE WHEN @sort_field = 'linkedin_url' AND @sort_order = 'ASC' THEN linkedin_url END ASC,
        CASE WHEN @sort_field = 'linkedin_url' AND @sort_order = 'DESC' THEN linkedin_url END DESC,
        CASE WHEN @sort_field = 'website' AND @sort_order = 'ASC' THEN website END ASC,
        CASE WHEN @sort_field = 'website' AND @sort_order = 'DESC' THEN website END DESC,
        CASE WHEN @sort_field = 'phone_number' AND @sort_order = 'ASC' THEN phone_number END ASC,
        CASE WHEN @sort_field = 'phone_number' AND @sort_order = 'DESC' THEN phone_number END DESC,
        CASE WHEN @sort_field = 'address' AND @sort_order = 'ASC' THEN address END ASC,
        CASE WHEN @sort_field = 'address' AND @sort_order = 'DESC' THEN address END DESC,
        CASE WHEN @sort_field = 'zipcode' AND @sort_order = 'ASC' THEN zipcode END ASC,
        CASE WHEN @sort_field = 'zipcode' AND @sort_order = 'DESC' THEN zipcode END DESC,
        CASE WHEN @sort_field = 'city' AND @sort_order = 'ASC' THEN city END ASC,
        CASE WHEN @sort_field = 'city' AND @sort_order = 'DESC' THEN city END DESC,
        CASE WHEN @sort_field = 'state_abbr' AND @sort_order = 'ASC' THEN state_abbr END ASC,
        CASE WHEN @sort_field = 'state_abbr' AND @sort_order = 'DESC' THEN state_abbr END DESC,
        CASE WHEN @sort_field = 'country' AND @sort_order = 'ASC' THEN country END ASC,
        CASE WHEN @sort_field = 'country' AND @sort_order = 'DESC' THEN country END DESC,
        CASE WHEN @sort_field = 'description' AND @sort_order = 'ASC' THEN description END ASC,
        CASE WHEN @sort_field = 'description' AND @sort_order = 'DESC' THEN description END DESC,
        CASE WHEN @sort_field = 'revenue' AND @sort_order = 'ASC' THEN revenue END ASC,
        CASE WHEN @sort_field = 'revenue' AND @sort_order = 'DESC' THEN revenue END DESC,
        CASE WHEN @sort_field = 'tax_identifier' AND @sort_order = 'ASC' THEN tax_identifier END ASC,
        CASE WHEN @sort_field = 'tax_identifier' AND @sort_order = 'DESC' THEN tax_identifier END DESC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC,
        CASE WHEN @sort_field = 'logo_src' AND @sort_order = 'ASC' THEN logo_src END ASC,
        CASE WHEN @sort_field = 'logo_src' AND @sort_order = 'DESC' THEN logo_src END DESC,
        CASE WHEN @sort_field = 'logo_title' AND @sort_order = 'ASC' THEN logo_title END ASC,
        CASE WHEN @sort_field = 'logo_title' AND @sort_order = 'DESC' THEN logo_title END DESC,
        CASE WHEN @sort_field = 'logo_path' AND @sort_order = 'ASC' THEN logo_path END ASC,
        CASE WHEN @sort_field = 'logo_path' AND @sort_order = 'DESC' THEN logo_path END DESC,
        CASE WHEN @sort_field = 'logo_type' AND @sort_order = 'ASC' THEN logo_type END ASC,
        CASE WHEN @sort_field = 'logo_type' AND @sort_order = 'DESC' THEN logo_type END DESC,
        CASE WHEN @sort_field = 'context_links' AND @sort_order = 'ASC' THEN context_links END ASC,
        CASE WHEN @sort_field = 'context_links' AND @sort_order = 'DESC' THEN context_links END DESC,
        CASE WHEN @sort_field IS NULL THEN id END ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END
