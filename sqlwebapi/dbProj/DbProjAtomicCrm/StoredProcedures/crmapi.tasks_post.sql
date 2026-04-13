CREATE PROCEDURE [crmapi].[tasks_post](
    @contact_id int = NULL,
    @sales_id int = NULL,
    @type nvarchar(80) = NULL,
    @text nvarchar(max) = NULL,
    @due_date datetime2 = NULL,
    @done_date datetime2 = NULL,
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

    INSERT INTO crm.tasks (
        tenant,
        contact_id,
        sales_id,
        type,
        text,
        due_date,
        done_date
    )
    VALUES (
        @auth_tenant,
        @contact_id,
        @sales_id,
        @type,
        @text,
        @due_date,
        @done_date
    );

    DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY();
    EXEC crmapi.tasks_get @ID = @NEWID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
