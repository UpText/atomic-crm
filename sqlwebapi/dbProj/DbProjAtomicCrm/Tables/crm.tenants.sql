CREATE TABLE [crm].[tenants] (
    [name] [nvarchar](255) NOT NULL,
    [display_name] [nvarchar](255) NULL,
    [created_at] [datetime2](0) NOT NULL CONSTRAINT [DF_tenants_created_at] DEFAULT (sysutcdatetime()),
    CONSTRAINT [PK_tenants] PRIMARY KEY CLUSTERED ([name] ASC)
);
