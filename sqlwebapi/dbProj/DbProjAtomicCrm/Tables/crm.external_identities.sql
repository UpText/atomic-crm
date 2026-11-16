CREATE TABLE [crm].[external_identities] (
    [tenant] nvarchar(255) NOT NULL,
    [directory_id] uniqueidentifier NOT NULL,
    [object_id] uniqueidentifier NOT NULL,
    [client_id] uniqueidentifier NOT NULL,
    [sales_id] int NOT NULL,
    [invited_by] int NULL,
    [created_at] datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    [expires_at] datetime2 NOT NULL,
    [activated_at] datetime2 NULL,
    [revoked_at] datetime2 NULL,
    CONSTRAINT [PK_external_identities] PRIMARY KEY ([tenant], [directory_id], [object_id]),
    CONSTRAINT [FK_external_identities_sales] FOREIGN KEY ([tenant], [sales_id]) REFERENCES [crm].[sales] ([tenant], [id])
);
