CREATE PROCEDURE [crmapi].[contacts_summary_get](
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

    DECLARE @search NVARCHAR(200) = (SELECT TOP 1 '%' + value + '%' FROM OPENJSON(@filter, '$."@or"'));
    DECLARE @last_seen_gte datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."last_seen@gte"')));
    DECLARE @last_seen_gt datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."last_seen@gt"')));
    DECLARE @last_seen_lte datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."last_seen@lte"')));
    DECLARE @last_seen_lt datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."last_seen@lt"')));
    DECLARE @last_seen_eq datetime2(3) = TRY_CONVERT(datetime2(3), CONVERT(datetimeoffset(3), JSON_VALUE(@filter, N'$."last_seen@eq"')));
    DECLARE @status NVARCHAR(50) = JSON_VALUE(@filter, N'$.status');
    DECLARE @tasks_count_gt INT = TRY_CONVERT(INT, JSON_VALUE(@filter, N'$."nb_tasks@gt"'));
    DECLARE @tags_cs NVARCHAR(100) = JSON_VALUE(@filter, N'$."tags@cs"');
    DECLARE @tags_id INT = TRY_CAST(REPLACE(REPLACE(@tags_cs, '{', ''), '}', '') AS INT);
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
        emails_json AS email_jsonb,
        phones_json AS phone_jsonb,
        avatar_title,
        avatar_path,
        avatar_type,
        COUNT(*) OVER() AS total_rows,
        (SELECT name FROM crm.companies WHERE companies.id = company_id AND companies.tenant = @auth_tenant) AS company_name,
        (SELECT COUNT(*) FROM crm.tasks WHERE tasks.contact_id = crm.contacts.id AND tasks.tenant = @auth_tenant) AS nb_tasks,
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
      AND (@tags_id IS NULL OR EXISTS (
            SELECT 1
            FROM crm.contact_tags ct
            WHERE ct.contact_id = crm.contacts.id
              AND ct.tag_id = @tags_id
              AND ct.tenant = @auth_tenant
      ))
      AND (
            @search IS NULL
            OR first_name LIKE @search
            OR last_name LIKE @search
            OR title LIKE @search
            OR linkedin_url LIKE @search
            OR background LIKE @search
            OR emails_json LIKE @search
            OR phones_json LIKE @search
      )
      AND (@last_seen_gte IS NULL OR last_seen >= @last_seen_gte)
      AND (@last_seen_gt IS NULL OR last_seen > @last_seen_gt)
      AND (@last_seen_lte IS NULL OR last_seen <= @last_seen_lte)
      AND (@last_seen_lt IS NULL OR last_seen < @last_seen_lt)
      AND (@last_seen_eq IS NULL OR last_seen = @last_seen_eq)
      AND (@status IS NULL OR status = @status)
      AND (@tasks_count_gt IS NULL OR (
            SELECT COUNT(*)
            FROM crm.tasks
            WHERE tasks.contact_id = crm.contacts.id
              AND tasks.tenant = @auth_tenant
      ) > @tasks_count_gt)
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
        CASE WHEN @sort_field = 'gender' AND @sort_order = 'ASC' THEN gender END ASC,
        CASE WHEN @sort_field = 'gender' AND @sort_order = 'DESC' THEN gender END DESC,
        CASE WHEN @sort_field = 'status' AND @sort_order = 'ASC' THEN status END ASC,
        CASE WHEN @sort_field = 'status' AND @sort_order = 'DESC' THEN status END DESC,
        CASE WHEN @sort_field = 'last_seen' AND @sort_order = 'ASC' THEN last_seen END ASC,
        CASE WHEN @sort_field = 'last_seen' AND @sort_order = 'DESC' THEN last_seen END DESC,
        CASE WHEN @sort_field IS NULL THEN id END ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END
