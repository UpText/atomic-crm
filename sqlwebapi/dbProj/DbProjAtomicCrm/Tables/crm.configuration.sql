CREATE TABLE [crm].[configuration] (
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_configuration_tenant] DEFAULT ('default'),
    [id] [int] NOT NULL,
    [config] [nvarchar](MAX) NOT NULL,
    [updated_at] [datetime2](3) NOT NULL CONSTRAINT [DF_configuration_updated_at] DEFAULT (sysutcdatetime()),
    [updated_by] [nvarchar](256) NULL,
    [row_version] [timestamp] NOT NULL,
    CONSTRAINT [PK_configuration] PRIMARY KEY CLUSTERED ([tenant] ASC, [id] ASC),
    CONSTRAINT [CK_configuration_config_is_json] CHECK (isjson([config])=(1)),
    CONSTRAINT [CK_configuration_singleton] CHECK ([id]=(1)),
    CONSTRAINT [FK_configuration_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
