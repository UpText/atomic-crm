CREATE PROCEDURE [crmapi].[sales_Password_Put](
    @id VARCHAR(MAX),
    @passwordHash NVARCHAR(256),
    @auth_email VARCHAR(MAX),
    @auth_tenant NVARCHAR(255)
) AS
BEGIN
    DECLARE @user_id INT;
    DECLARE @IsAdmin BIT;

    SELECT @user_id = id, @IsAdmin = administrator
    FROM crm.sales
    WHERE email = @auth_email
      AND tenant = @auth_tenant;

    IF @user_id IS NULL
        RETURN 401;

    IF @IsAdmin = 0 AND @user_id != @id
    BEGIN
        RAISERROR('Unauthorized', 16, 1);
        RETURN 400;
    END

    IF @passwordHash IS NULL OR @passwordHash NOT LIKE N'$argon2id$v=19$%'
    BEGIN
        RAISERROR('An Argon2id password hash is required.', 16, 1);
        RETURN 400;
    END

    UPDATE crm.sales
    SET PasswordHash = @passwordHash
    WHERE id = @id
      AND tenant = @auth_tenant;
END
