CREATE PROCEDURE [crmapi].[companies_put](
    @ID varchar(max),
    @name nvarchar(200) = NULL,
    @sector nvarchar(100) = NULL,
    @size int = NULL,
    @linkedin_url nvarchar(2048) = NULL,
    @website nvarchar(2048) = NULL,
    @phone_number nvarchar(50) = NULL,
    @address nvarchar(300) = NULL,
    @zipcode nvarchar(20) = NULL,
    @city nvarchar(100) = NULL,
    @state_abbr nvarchar(20) = NULL,
    @country nvarchar(100) = NULL,
    @description nvarchar(max) = NULL,
    @revenue nvarchar(50) = NULL,
    @tax_identifier nvarchar(100) = NULL,
    @created_at datetime2 = NULL,
    @sales_id int = NULL,
    @logo nvarchar(MAX) = NULL,
    @context_links nvarchar(max) = NULL,
    @auth_email NVARCHAR(255) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    IF NOT EXISTS(SELECT 1 FROM crm.companies WHERE id = @ID AND tenant = @auth_tenant)
    BEGIN
        RAISERROR('Unknown companies', 1, 1);
        RETURN 404;
    END

    DECLARE @logo_title nvarchar(255) = JSON_VALUE(@logo, '$."title"');
    DECLARE @logo_path nvarchar(1024) = JSON_VALUE(@logo, '$."path"');
    DECLARE @logo_type nvarchar(128) = JSON_VALUE(@logo, '$."type"');
    DECLARE @logo_src nvarchar(MAX) = JSON_VALUE(@logo, '$."src"');

    UPDATE crm.companies
    SET name = COALESCE(@name, name),
        sector = COALESCE(@sector, sector),
        size = COALESCE(@size, size),
        linkedin_url = COALESCE(@linkedin_url, linkedin_url),
        website = COALESCE(@website, website),
        phone_number = COALESCE(@phone_number, phone_number),
        address = COALESCE(@address, address),
        zipcode = COALESCE(@zipcode, zipcode),
        city = COALESCE(@city, city),
        state_abbr = COALESCE(@state_abbr, state_abbr),
        country = COALESCE(@country, country),
        description = COALESCE(@description, description),
        revenue = COALESCE(@revenue, revenue),
        tax_identifier = COALESCE(@tax_identifier, tax_identifier),
        created_at = COALESCE(@created_at, created_at),
        logo_src = COALESCE(@logo_src, logo_src),
        logo_title = COALESCE(@logo_title, logo_title),
        logo_path = COALESCE(@logo_path, logo_path),
        logo_type = COALESCE(@logo_type, logo_type),
        context_links = COALESCE(@context_links, context_links)
    WHERE id = @ID
      AND tenant = @auth_tenant;

    EXEC crmapi.companies_Get @ID = @ID, @auth_email = @auth_email, @auth_tenant = @auth_tenant;
    RETURN 200;
END
