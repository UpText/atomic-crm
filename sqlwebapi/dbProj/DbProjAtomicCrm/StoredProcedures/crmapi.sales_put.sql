CREATE PROCEDURE [crmapi].[sales_put](
    @ID varchar(max),
    @email nvarchar(320) = NULL,
    @first_name nvarchar(100) = NULL,
    @last_name nvarchar(100) = NULL,
    @administrator bit = NULL,
    @disabled bit = NULL,
    @avatar nvarchar(max) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    IF NOT EXISTS(SELECT 1 FROM crm.sales WHERE id = @ID AND tenant = @auth_tenant)
    BEGIN
        RAISERROR('Unknown sales', 1, 1);
        RETURN 404;
    END

    DECLARE @avatar_src nvarchar(MAX) = NULL;
    DECLARE @avatar_title nvarchar(255) = NULL;
    DECLARE @avatar_path nvarchar(1024) = NULL;
    DECLARE @avatar_type nvarchar(128) = NULL;

    IF @avatar IS NOT NULL AND ISJSON(@avatar) = 1
    BEGIN
        SET @avatar_src = JSON_VALUE(@avatar, '$.src');
        SET @avatar_title = JSON_VALUE(@avatar, '$.title');
        SET @avatar_path = JSON_VALUE(@avatar, '$.path');
        SET @avatar_type = JSON_VALUE(@avatar, '$.type');
    END

    UPDATE crm.sales
    SET email = COALESCE(@email, email),
        first_name = COALESCE(@first_name, first_name),
        last_name = COALESCE(@last_name, last_name),
        administrator = COALESCE(@administrator, administrator),
        disabled = COALESCE(@disabled, disabled),
        avatar_src = COALESCE(@avatar_src, avatar_src),
        avatar_title = COALESCE(@avatar_title, avatar_title),
        avatar_path = COALESCE(@avatar_path, avatar_path),
        avatar_type = COALESCE(@avatar_type, avatar_type)
    WHERE id = @ID
      AND tenant = @auth_tenant;

    EXEC crmapi.sales_get @ID = @ID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
