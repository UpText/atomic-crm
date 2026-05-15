CREATE PROCEDURE [crmapi].[contacts_post](
    @first_name nvarchar(100) = NULL,
    @last_name nvarchar(100) = NULL,
    @title nvarchar(150) = NULL,
    @company_id int = NULL,
    @sales_id int = NULL,
    @linkedin_url nvarchar(2048) = NULL,
    @first_seen datetime2 = NULL,
    @last_seen datetime2 = NULL,
    @has_newsletter bit = NULL,
    @gender nvarchar(50) = NULL,
    @status nvarchar(50) = 'new',
    @background nvarchar(max) = NULL,
    @emails_jsonb nvarchar(max) = NULL,
    @phones_jsonb nvarchar(max) = NULL,
    @avatar_src nvarchar(2048) = NULL,
    @avatar_title nvarchar(255) = NULL,
    @avatar_path nvarchar(1024) = NULL,
    @avatar_type nvarchar(128) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    IF @sales_id IS NULL OR @sales_id = 0
    BEGIN
        SELECT TOP 1 @sales_id = id
        FROM crm.sales
        WHERE tenant = @auth_tenant
        ORDER BY id;
    END

    INSERT INTO crm.contacts (
        tenant,
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
        avatar_type
    )
    VALUES (
        @auth_tenant,
        @first_name,
        @last_name,
        COALESCE(@title, N''),
        @company_id,
        @sales_id,
        @linkedin_url,
        @first_seen,
        @last_seen,
        @has_newsletter,
        @gender,
        @status,
        @background,
        @emails_jsonb,
        @phones_jsonb,
        @avatar_src,
        @avatar_title,
        @avatar_path,
        @avatar_type
    );

    DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY();
    EXEC crmapi.contacts_summary_get @ID = @NEWID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
