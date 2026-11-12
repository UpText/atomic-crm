CREATE PROCEDURE [crmapi].[sync-tenant-admin_post](
    @auth_tenant NVARCHAR(255) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    IF @auth_tenant IS NULL OR @auth_tenant <> N'admin'
    BEGIN
        RAISERROR('Only admin tenant members can sync tenants.', 16, 1);
        RETURN 403;
    END;

    DECLARE @sales_id INT = (
        SELECT TOP (1) id FROM crm.sales
        WHERE tenant = N'admin' AND administrator = 1 AND disabled = 0
        ORDER BY id
    );
    IF @sales_id IS NULL
    BEGIN
        RAISERROR('An active administrator in the admin tenant is required.', 16, 1);
        RETURN 400;
    END;

    DECLARE @companies_created INT, @contacts_created INT,
        @companies_synced INT, @contacts_synced INT, @lock_result INT;

    BEGIN TRY
        BEGIN TRANSACTION;
        -- Serialize sync requests so concurrent runs cannot insert duplicates.
        EXEC @lock_result = sys.sp_getapplock
            @Resource = N'crm.sync-tenant-admin', @LockMode = 'Exclusive',
            @LockOwner = 'Transaction', @LockTimeout = 15000;
        IF @lock_result < 0
            THROW 50000, 'Unable to acquire tenant sync lock. Please retry.', 1;

        UPDATE c
        SET name = LEFT(COALESCE(NULLIF(t.display_name, N''), t.name), 200)
        FROM crm.companies c
        INNER JOIN crm.tenants t ON t.name = c.source_tenant
        WHERE c.tenant = N'admin' AND t.name <> N'admin';

        INSERT INTO crm.companies (tenant, source_tenant, name, created_at, sales_id)
        SELECT N'admin', t.name,
            LEFT(COALESCE(NULLIF(t.display_name, N''), t.name), 200),
            t.created_at, @sales_id
        FROM crm.tenants t
        WHERE t.name <> N'admin'
          AND NOT EXISTS (
              SELECT 1 FROM crm.companies c
              WHERE c.tenant = N'admin' AND c.source_tenant = t.name
          );
        SET @companies_created = @@ROWCOUNT;

        UPDATE c
        SET first_name = COALESCE(s.first_name, N''),
            last_name = COALESCE(s.last_name, N''),
            company_id = company.id,
            emails_json = (SELECT s.email AS email, N'Work' AS type
                          WHERE s.email IS NOT NULL FOR JSON PATH)
        FROM crm.contacts c
        INNER JOIN crm.sales s ON s.id = c.source_sales_id
        INNER JOIN crm.companies company
            ON company.tenant = N'admin' AND company.source_tenant = s.tenant
        WHERE c.tenant = N'admin' AND s.tenant <> N'admin';

        INSERT INTO crm.contacts (
            tenant, source_sales_id, first_name, last_name, title,
            company_id, sales_id, first_seen, emails_json
        )
        SELECT N'admin', s.id, COALESCE(s.first_name, N''),
            COALESCE(s.last_name, N''), N'', company.id, @sales_id, s.created_at,
            (SELECT s.email AS email, N'Work' AS type
             WHERE s.email IS NOT NULL FOR JSON PATH)
        FROM crm.sales s
        INNER JOIN crm.companies company
            ON company.tenant = N'admin' AND company.source_tenant = s.tenant
        WHERE s.tenant <> N'admin'
          AND NOT EXISTS (
              SELECT 1 FROM crm.contacts c
              WHERE c.tenant = N'admin' AND c.source_sales_id = s.id
          );
        SET @contacts_created = @@ROWCOUNT;

        SELECT @companies_synced = COUNT(*) FROM crm.tenants WHERE name <> N'admin';
        SELECT @contacts_synced = COUNT(*) FROM crm.sales WHERE tenant <> N'admin';
        COMMIT TRANSACTION;

        SELECT N'ok' AS status,
            @companies_created AS companies_created,
            @contacts_created AS contacts_created,
            @companies_synced AS companies_synced,
            @contacts_synced AS contacts_synced;
        RETURN 200;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
