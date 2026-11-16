CREATE PROCEDURE [crmapi].[sales_delete](
    @ID varchar(max) = NULL,
    @auth_tenant nvarchar(255) = NULL,
    @auth_id int = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @sales_id int = TRY_CONVERT(int, @ID);
    IF @sales_id IS NULL OR @sales_id <= 0
    BEGIN
        SELECT N'A valid user ID is required.' AS message;
        RETURN 400;
    END;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (
            SELECT 1
            FROM crm.sales s WITH (UPDLOCK, HOLDLOCK)
            JOIN crm.tenants t WITH (HOLDLOCK) ON t.name = s.tenant AND t.active = 1
            WHERE s.tenant = @auth_tenant AND s.id = @auth_id
              AND s.administrator = 1 AND s.disabled = 0
        )
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT N'An active tenant administrator is required.' AS message;
            RETURN 403;
        END;

        IF NOT EXISTS (
            SELECT 1 FROM crm.sales WITH (UPDLOCK, HOLDLOCK)
            WHERE tenant = @auth_tenant AND id = @sales_id
        )
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT N'User not found in this tenant.' AS message;
            RETURN 404;
        END;

        -- The deleting administrator remains active, preserving administrator access.
        IF @sales_id = @auth_id
        BEGIN
            ROLLBACK TRANSACTION;
            SELECT N'You cannot delete your own account.' AS message;
            RETURN 409;
        END;

        DELETE FROM crm.external_identities
        WHERE tenant = @auth_tenant AND sales_id = @sales_id;

        -- Foreign keys deliberately prevent deleting users referenced by CRM data.
        DELETE FROM crm.sales
        WHERE tenant = @auth_tenant AND id = @sales_id;

        COMMIT TRANSACTION;
        -- SQLWebAPI uses a returned ID to distinguish successful deletes from missing records.
        SELECT @sales_id AS id;
        RETURN 204;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        IF ERROR_NUMBER() = 547
        BEGIN
            SELECT N'This user is referenced by CRM records. Disable the account instead.' AS message;
            RETURN 409;
        END;
        THROW;
    END CATCH;
END
