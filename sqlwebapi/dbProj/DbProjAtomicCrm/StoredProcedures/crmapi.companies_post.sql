CREATE PROCEDURE [crmapi].[companies_Post](
    @name nvarchar(200) = NULL,
    @sector nvarchar(100) = '',
    @size int = 1,
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
    @logo_src nvarchar(2048) = NULL,
    @logo_title nvarchar(255) = NULL,
    @logo_path nvarchar(1024) = NULL,
    @logo_type nvarchar(128) = NULL,
    @context_links nvarchar(max) = NULL,
    @auth_email NVARCHAR(255) = NULL,
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

    INSERT INTO crm.companies (
        tenant,
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
        logo_src,
        logo_title,
        logo_path,
        logo_type,
        context_links
    )
    VALUES (
        @auth_tenant,
        @name,
        @sector,
        @size,
        @linkedin_url,
        @website,
        @phone_number,
        @address,
        @zipcode,
        @city,
        @state_abbr,
        @country,
        @description,
        @revenue,
        @tax_identifier,
        @created_at,
        @sales_id,
        @logo_src,
        @logo_title,
        @logo_path,
        @logo_type,
        @context_links
    );

    DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY();
    EXEC crmapi.companies_Get @ID = @NEWID, @auth_email = @auth_email, @auth_tenant = @auth_tenant;
    RETURN 200;
END
