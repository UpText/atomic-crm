CREATE PROCEDURE [crmapi].[contacts_get](
    @ID varchar(max) = NULL,
    @filter varchar(max)=NULL,
    @first_row INT = 0,
    @last_row INT = 1000,
    @sort_field NVARCHAR(100) = NULL,
    @sort_order NVARCHAR(4) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    DECLARE @company_id INT = JSON_VALUE(@filter, N'$.company_id');

    SELECT
        id,
        first_name,
        last_name,
        title,
        company_id,
        sales_id,
        linkedin_url,
        first_seen,
        last_seen,
        has_newsletter,
        gender,
        status,
        background,
        emails_json,
        phones_json,
        avatar_src,
        avatar_title,
        avatar_path,
        avatar_type,
        COUNT(*) OVER() AS total_rows,
        COALESCE((
            SELECT
                '[' + STRING_AGG(CONVERT(varchar(20), ct.tag_id), ',')
                WITHIN GROUP (ORDER BY ct.tag_id) + ']'
            FROM crm.contact_tags ct
            WHERE ct.contact_id = crm.contacts.id
              AND ct.tenant = @auth_tenant
        ), '[]') AS tags
    FROM crm.contacts
    WHERE tenant = @auth_tenant
      AND (@ID IS NULL OR @ID = id)
      AND (
            @filter IS NULL
            OR NOT EXISTS (SELECT 1 FROM OPENJSON(@filter, '$.id'))
            OR id IN (SELECT value FROM OPENJSON(@filter, '$.id'))
      )
      AND (@company_id IS NULL OR company_id = @company_id)
    ORDER BY
        CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC,
        CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC,
        CASE WHEN @sort_field = 'first_name' AND @sort_order = 'ASC' THEN first_name END ASC,
        CASE WHEN @sort_field = 'first_name' AND @sort_order = 'DESC' THEN first_name END DESC,
        CASE WHEN @sort_field = 'last_name' AND @sort_order = 'ASC' THEN last_name END ASC,
        CASE WHEN @sort_field = 'last_name' AND @sort_order = 'DESC' THEN last_name END DESC,
        CASE WHEN @sort_field = 'title' AND @sort_order = 'ASC' THEN title END ASC,
        CASE WHEN @sort_field = 'title' AND @sort_order = 'DESC' THEN title END DESC,
        CASE WHEN @sort_field = 'company_id' AND @sort_order = 'ASC' THEN company_id END ASC,
        CASE WHEN @sort_field = 'company_id' AND @sort_order = 'DESC' THEN company_id END DESC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'ASC' THEN sales_id END ASC,
        CASE WHEN @sort_field = 'sales_id' AND @sort_order = 'DESC' THEN sales_id END DESC,
        CASE WHEN @sort_field = 'linkedin_url' AND @sort_order = 'ASC' THEN linkedin_url END ASC,
        CASE WHEN @sort_field = 'linkedin_url' AND @sort_order = 'DESC' THEN linkedin_url END DESC,
        CASE WHEN @sort_field = 'gender' AND @sort_order = 'ASC' THEN gender END ASC,
        CASE WHEN @sort_field = 'gender' AND @sort_order = 'DESC' THEN gender END DESC,
        CASE WHEN @sort_field = 'status' AND @sort_order = 'ASC' THEN status END ASC,
        CASE WHEN @sort_field = 'status' AND @sort_order = 'DESC' THEN status END DESC,
        CASE WHEN @sort_field = 'background' AND @sort_order = 'ASC' THEN background END ASC,
        CASE WHEN @sort_field = 'background' AND @sort_order = 'DESC' THEN background END DESC,
        CASE WHEN @sort_field = 'emails_json' AND @sort_order = 'ASC' THEN emails_json END ASC,
        CASE WHEN @sort_field = 'emails_json' AND @sort_order = 'DESC' THEN emails_json END DESC,
        CASE WHEN @sort_field = 'phones_json' AND @sort_order = 'ASC' THEN phones_json END ASC,
        CASE WHEN @sort_field = 'phones_json' AND @sort_order = 'DESC' THEN phones_json END DESC,
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
