CREATE PROCEDURE [crmapi].[companies_delete](
    @ID varchar(max) = NULL,
    @auth_email NVARCHAR(255) = NULL,
    @auth_tenant NVARCHAR(255) = NULL
) AS
BEGIN
    IF @ID IS NULL
    BEGIN
        RAISERROR('ID parameter is required', 16, 1);
        RETURN 400;
    END

    IF EXISTS(SELECT 1 FROM crm.deals WHERE tenant = @auth_tenant AND company_id = @ID)
    BEGIN
        RAISERROR('Cannot delete company with existing deals', 16, 1);
        RETURN 400;
    END

    DELETE FROM crm.companies
    WHERE id = @ID
      AND tenant = @auth_tenant;

    RETURN 204;
END
