CREATE PROCEDURE [crmapi].[contacts_put](
    @ID varchar(max),
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
    @status nvarchar(50) = NULL,
    @background nvarchar(max) = NULL,
    @email_jsonb nvarchar(max) = NULL,
    @phone_jsonb nvarchar(max) = NULL,
    @avatar_src nvarchar(2048) = NULL,
    @avatar_title nvarchar(255) = NULL,
    @avatar_path nvarchar(1024) = NULL,
    @avatar_type nvarchar(128) = NULL,
    @tags nvarchar(max) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    IF NOT EXISTS(SELECT 1 FROM crm.contacts WHERE id = @ID AND tenant = @auth_tenant)
    BEGIN
        RAISERROR('Unknown contacts', 1, 1);
        RETURN 404;
    END

    UPDATE crm.contacts
    SET first_name = COALESCE(@first_name, first_name),
        last_name = COALESCE(@last_name, last_name),
        title = COALESCE(@title, title),
        company_id = COALESCE(@company_id, company_id),
        linkedin_url = COALESCE(@linkedin_url, linkedin_url),
        first_seen = COALESCE(@first_seen, first_seen),
        last_seen = COALESCE(@last_seen, last_seen),
        has_newsletter = COALESCE(@has_newsletter, has_newsletter),
        gender = COALESCE(@gender, gender),
        status = COALESCE(@status, status),
        background = COALESCE(@background, background),
        emails_json = COALESCE(@email_jsonb, emails_json),
        phones_json = COALESCE(@phone_jsonb, phones_json),
        avatar_src = COALESCE(@avatar_src, avatar_src),
        avatar_title = COALESCE(@avatar_title, avatar_title),
        avatar_path = COALESCE(@avatar_path, avatar_path),
        avatar_type = COALESCE(@avatar_type, avatar_type)
    WHERE id = @ID
      AND tenant = @auth_tenant;

    IF @tags IS NOT NULL
    BEGIN
        DELETE FROM crm.contact_tags
        WHERE contact_id = @ID
          AND tenant = @auth_tenant;

        INSERT INTO crm.contact_tags (tenant, contact_id, tag_id)
        SELECT @auth_tenant, @ID, value
        FROM OPENJSON(@tags);
    END

    EXEC crmapi.contacts_get @ID = @ID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
