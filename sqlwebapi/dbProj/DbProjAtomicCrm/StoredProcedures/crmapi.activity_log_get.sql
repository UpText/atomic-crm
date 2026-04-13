CREATE PROCEDURE [crmapi].[activity_log_get](
    @ID varchar(max) = NULL,
    @filter varchar(max) = NULL,
    @first_row INT = 0,
    @last_row INT = 1000,
    @sort_field NVARCHAR(100) = NULL,
    @sort_order NVARCHAR(4) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @company_id INT = TRY_CONVERT(INT, JSON_VALUE(@filter, N'$.company_id'));

    WITH activity_events AS (
        SELECT
            CONCAT('company.', c.id, '.created') AS id,
            CAST('company.created' AS NVARCHAR(50)) AS [type],
            c.created_at AS [date],
            c.id AS company_id,
            c.sales_id,
            (
                SELECT
                    c.id,
                    c.name,
                    c.sector,
                    c.size,
                    c.linkedin_url,
                    c.website,
                    c.phone_number,
                    c.address,
                    c.zipcode,
                    c.city,
                    c.state_abbr,
                    c.country,
                    c.description,
                    c.revenue,
                    c.tax_identifier,
                    c.created_at,
                    c.sales_id,
                    JSON_QUERY((
                        SELECT
                            c.logo_src AS [src],
                            c.logo_title AS [title],
                            c.logo_path AS [path],
                            c.logo_type AS [type]
                        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                    )) AS logo,
                    CASE
                        WHEN ISJSON(c.context_links) = 1 THEN JSON_QUERY(c.context_links)
                        ELSE NULL
                    END AS context_links
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ) AS company,
            CAST(NULL AS NVARCHAR(MAX)) AS contact,
            CAST(NULL AS NVARCHAR(MAX)) AS deal,
            CAST(NULL AS NVARCHAR(MAX)) AS contactNote,
            CAST(NULL AS NVARCHAR(MAX)) AS dealNote
        FROM crm.companies c
        WHERE c.tenant = @auth_tenant

        UNION ALL

        SELECT
            CONCAT('contact.', co.id, '.created') AS id,
            CAST('contact.created' AS NVARCHAR(50)) AS [type],
            co.first_seen AS [date],
            co.company_id,
            co.sales_id,
            CAST(NULL AS NVARCHAR(MAX)) AS company,
            (
                SELECT
                    co.id,
                    co.first_name,
                    co.last_name,
                    co.title,
                    co.company_id,
                    co.sales_id,
                    co.linkedin_url,
                    co.first_seen,
                    co.last_seen,
                    co.has_newsletter,
                    co.gender,
                    co.status,
                    co.background,
                    JSON_QUERY(co.emails_json) AS email_jsonb,
                    JSON_QUERY(co.phones_json) AS phone_jsonb,
                    JSON_QUERY((
                        SELECT
                            co.avatar_src AS [src],
                            co.avatar_title AS [title],
                            co.avatar_path AS [path],
                            co.avatar_type AS [type]
                        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                    )) AS avatar,
                    JSON_QUERY(COALESCE((
                        SELECT
                            '[' + STRING_AGG(CONVERT(varchar(20), ct.tag_id), ',')
                            WITHIN GROUP (ORDER BY ct.tag_id) + ']'
                        FROM crm.contact_tags ct
                        WHERE ct.contact_id = co.id
                          AND ct.tenant = @auth_tenant
                    ), '[]')) AS tags
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ) AS contact,
            CAST(NULL AS NVARCHAR(MAX)) AS deal,
            CAST(NULL AS NVARCHAR(MAX)) AS contactNote,
            CAST(NULL AS NVARCHAR(MAX)) AS dealNote
        FROM crm.contacts co
        WHERE co.tenant = @auth_tenant

        UNION ALL

        SELECT
            CONCAT('contactNote.', cn.id, '.created') AS id,
            CAST('contactNote.created' AS NVARCHAR(50)) AS [type],
            cn.[date],
            co.company_id,
            cn.sales_id,
            CAST(NULL AS NVARCHAR(MAX)) AS company,
            CAST(NULL AS NVARCHAR(MAX)) AS contact,
            CAST(NULL AS NVARCHAR(MAX)) AS deal,
            (
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
                            na.src,
                            na.title,
                            na.[path],
                            na.[type],
                            na.created_at
                        FROM crm.note_attachments na
                        WHERE na.contact_note_id = cn.id
                          AND na.tenant = @auth_tenant
                        FOR JSON PATH
                    )) AS attachments
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ) AS contactNote,
            CAST(NULL AS NVARCHAR(MAX)) AS dealNote
        FROM crm.contact_notes cn
        LEFT JOIN crm.contacts co
          ON co.id = cn.contact_id
         AND co.tenant = @auth_tenant
        WHERE cn.tenant = @auth_tenant

        UNION ALL

        SELECT
            CONCAT('deal.', d.id, '.created') AS id,
            CAST('deal.created' AS NVARCHAR(50)) AS [type],
            d.created_at AS [date],
            d.company_id,
            d.sales_id,
            CAST(NULL AS NVARCHAR(MAX)) AS company,
            CAST(NULL AS NVARCHAR(MAX)) AS contact,
            (
                SELECT
                    d.id,
                    d.name,
                    d.company_id,
                    d.category,
                    d.stage,
                    d.description,
                    d.amount,
                    d.created_at,
                    d.updated_at,
                    d.archived_at,
                    CONVERT(varchar(10), d.expected_closing_date, 23) AS expected_closing_date,
                    d.sales_id,
                    d.[index]
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ) AS deal,
            CAST(NULL AS NVARCHAR(MAX)) AS contactNote,
            CAST(NULL AS NVARCHAR(MAX)) AS dealNote
        FROM crm.deals d
        WHERE d.tenant = @auth_tenant

        UNION ALL

        SELECT
            CONCAT('dealNote.', dn.id, '.created') AS id,
            CAST('dealNote.created' AS NVARCHAR(50)) AS [type],
            dn.[date],
            d.company_id,
            dn.sales_id,
            CAST(NULL AS NVARCHAR(MAX)) AS company,
            CAST(NULL AS NVARCHAR(MAX)) AS contact,
            CAST(NULL AS NVARCHAR(MAX)) AS deal,
            CAST(NULL AS NVARCHAR(MAX)) AS contactNote,
            (
                SELECT
                    dn.id,
                    dn.deal_id,
                    dn.sales_id,
                    dn.[date],
                    dn.[text],
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
                    )) AS attachments
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            ) AS dealNote
        FROM crm.deal_notes dn
        LEFT JOIN crm.deals d
          ON d.id = dn.deal_id
         AND d.tenant = @auth_tenant
        WHERE dn.tenant = @auth_tenant
    ),
    filtered_events AS (
        SELECT *
        FROM activity_events
        WHERE (@ID IS NULL OR id = @ID)
          AND (@company_id IS NULL OR company_id = @company_id)
    )
    SELECT
        id,
        [type],
        [date],
        company_id,
        sales_id,
        JSON_QUERY(company) AS company,
        JSON_QUERY(contact) AS contact,
        JSON_QUERY(deal) AS deal,
        JSON_QUERY(contactNote) AS contactNote,
        JSON_QUERY(dealNote) AS dealNote,
        COUNT(*) OVER() AS total_rows
    FROM filtered_events
    ORDER BY
        CASE WHEN @sort_field = 'date' AND @sort_order = 'ASC' THEN [date] END ASC,
        CASE WHEN @sort_field = 'date' AND @sort_order = 'DESC' THEN [date] END DESC,
        CASE WHEN @sort_field = 'id' AND @sort_order = 'ASC' THEN id END ASC,
        CASE WHEN @sort_field = 'id' AND @sort_order = 'DESC' THEN id END DESC,
        CASE WHEN @sort_field IS NULL THEN [date] END DESC,
        id ASC
    OFFSET @first_row ROWS
    FETCH NEXT (@last_row - @first_row + 1) ROWS ONLY;
END
