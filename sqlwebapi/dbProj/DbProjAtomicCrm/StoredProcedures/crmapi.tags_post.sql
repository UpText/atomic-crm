CREATE PROCEDURE [crmapi].[tags_post](
    @name nvarchar(100) = NULL,
    @color nvarchar(30) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    IF @name IS NULL
    BEGIN
        RAISERROR('Name is required', 16, 1);
        RETURN 400;
    END

    INSERT INTO crm.tags (tenant, name, color)
    VALUES (@auth_tenant, @name, @color);

    DECLARE @NEWID AS VARCHAR(max) = SCOPE_IDENTITY();
    EXEC crmapi.tags_get @ID = @NEWID, @auth_tenant = @auth_tenant;
    RETURN 200;
END
