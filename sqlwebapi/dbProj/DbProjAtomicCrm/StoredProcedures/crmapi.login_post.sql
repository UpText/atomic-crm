CREATE PROCEDURE [crmapi].[Login_Post](
    @username NVARCHAR(255),
    @passwordHash NVARCHAR(256) = NULL OUTPUT,
    @tenant NVARCHAR(255)
) AS
BEGIN
    SET NOCOUNT ON;
    -- This procedure only looks up credentials. The API verifies the password
    -- before issuing a JWT. Do not add successful-login side effects here.
    SET @passwordHash = NULL;

    IF @tenant IS NULL OR LTRIM(RTRIM(@tenant)) = ''
        RETURN 401;

    IF EXISTS (
        SELECT 1 FROM crm.tenants
        WHERE name = @tenant AND active = 0
    )
        RETURN 403;

    DECLARE @sales_id INT;
    DECLARE @disabled BIT;
    SELECT @sales_id = id, @disabled = disabled
    FROM crm.sales
    WHERE tenant = @tenant AND email = @username;

    IF @sales_id IS NULL RETURN 401;
    IF @disabled = 1 RETURN 403;

    SELECT @passwordHash = PasswordHash
    FROM crm.sales
    WHERE id = @sales_id AND tenant = @tenant AND disabled = 0;

    IF @passwordHash IS NULL RETURN 401;

    -- Preserve the existing claims; the hash is only an OUTPUT parameter.
    SELECT id, tenant, user_id, email, first_name, last_name, administrator, disabled
    FROM crm.sales
    WHERE id = @sales_id AND tenant = @tenant AND disabled = 0;

    RETURN 200;
END
