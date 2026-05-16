CREATE PROCEDURE [crmapi].[deals_post](
    @name nvarchar(200) = NULL,
    @company_id int = NULL,
    @category nvarchar(80) = NULL,
    @stage nvarchar(80) = NULL,
    @description nvarchar(max) = NULL,
    @amount decimal = NULL,
    @expected_closing_date datetime2 = NULL,
    @sales_id int = NULL,
    @index int = NULL,
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

    INSERT INTO crm.deals (
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
        expected_closing_date,
        sales_id,
        [index]
    )
    VALUES (
        @auth_tenant,
        @name,
        @company_id,
        @category,
        @stage,
        COALESCE(@description, N''),
        @amount,
        GETDATE(),
        GETDATE(),
        NULL,
        @expected_closing_date,
        @sales_id,
        @index
    );

    DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY();
    EXEC crmapi.deals_get @ID = @NEWID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
