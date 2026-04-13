CREATE PROCEDURE [crmapi].[sales_post](
    @user_id varchar(50) = NULL,
    @email nvarchar(320) = NULL,
    @first_name nvarchar(100) = NULL,
    @last_name nvarchar(100) = NULL,
    @administrator bit = NULL,
    @disabled bit = 0,
    @avatar_src nvarchar(2048) = NULL,
    @avatar_title nvarchar(255) = NULL,
    @avatar_path nvarchar(1024) = NULL,
    @avatar_type nvarchar(128) = NULL,
    @auth_tenant NVARCHAR(255) = NULL,
    @passwordhash NVARCHAR(100) = NULL
) AS
BEGIN
    INSERT INTO crm.sales (
        tenant,
        user_id,
        email,
        first_name,
        last_name,
        administrator,
        disabled,
        avatar_src,
        avatar_title,
        avatar_path,
        avatar_type,
        passwordhash
    )
    VALUES (
        @auth_tenant,
        @user_id,
        @email,
        @first_name,
        @last_name,
        @administrator,
        @disabled,
        @avatar_src,
        @avatar_title,
        @avatar_path,
        @avatar_type,
        @passwordhash
   );

    DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY();
    EXEC crmapi.sales_get @ID = @NEWID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
