CREATE PROCEDURE [crmapi].[deals_put](
    @ID varchar(max),
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
    IF NOT EXISTS(SELECT 1 FROM crm.deals WHERE id = @ID AND tenant = @auth_tenant)
    BEGIN
        RAISERROR('Unknown deal.', 1, 1);
        RETURN 404;
    END

    UPDATE crm.deals
    SET name = COALESCE(@name, name),
        company_id = COALESCE(@company_id, company_id),
        category = COALESCE(@category, category),
        stage = COALESCE(@stage, stage),
        description = COALESCE(@description, description),
        amount = COALESCE(@amount, amount),
        updated_at = GETUTCDATE(),
        expected_closing_date = COALESCE(@expected_closing_date, expected_closing_date),
        sales_id = COALESCE(@sales_id, sales_id),
        [index] = COALESCE(@index, [index])
    WHERE id = @ID
      AND tenant = @auth_tenant;

    EXEC crmapi.deals_get @ID = @ID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
