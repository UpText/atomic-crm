CREATE PROCEDURE [crmapi].[Login_Post](
    @username NVARCHAR(255),
    @passwordHash NVARCHAR(255),
    @password NVARCHAR(255),
    @tenant NVARCHAR(255)
) AS
BEGIN
    IF @tenant IS NULL OR LTRIM(RTRIM(@tenant)) = ''
        RETURN 401;

    IF NOT EXISTS (
        SELECT 1
        FROM crm.sales
        WHERE tenant = @tenant
          AND email = @username
          AND PasswordHash = @passwordHash
    )
        RETURN 401;

    IF EXISTS (
        SELECT 1
        FROM crm.sales
        WHERE tenant = @tenant
          AND email = @username
          AND PasswordHash = @passwordHash
          AND disabled = 1
    )
        RETURN 403;

    SELECT TOP 1
        id,
        tenant,
        user_id,
        email,
        first_name,
        last_name,
        administrator,
        disabled
    FROM crm.sales
    WHERE tenant = @tenant
      AND email = @username
      AND PasswordHash = @passwordHash;
END
