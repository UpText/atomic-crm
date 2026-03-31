CREATE PROCEDURE [crmapi].[tasks_put](
    @ID varchar(max),
    @contact_id int = NULL,
    @sales_id int = NULL,
    @type nvarchar(80) = NULL,
    @text nvarchar(max) = NULL,
    @due_date datetime2 = NULL,
    @done_date datetime2 = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    IF NOT EXISTS(SELECT 1 FROM crm.tasks WHERE id = @ID AND tenant = @auth_tenant)
    BEGIN
        RAISERROR('Unknown tasks', 1, 1);
        RETURN 404;
    END

    UPDATE crm.tasks
    SET contact_id = COALESCE(@contact_id, contact_id),
        sales_id = COALESCE(@sales_id, sales_id),
        type = COALESCE(@type, type),
        text = COALESCE(@text, text),
        due_date = COALESCE(@due_date, due_date),
        done_date = COALESCE(@done_date, done_date)
    WHERE id = @ID
      AND tenant = @auth_tenant;

    EXEC crmapi.tasks_get @ID = @ID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
