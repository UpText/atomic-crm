CREATE TABLE [crm].[tags] (
    [id] [int] IDENTITY(1,1) NOT NULL,
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_tags_tenant] DEFAULT ('default'),
    [name] [nvarchar](100) NOT NULL,
    [color] [nvarchar](30) NOT NULL,
    CONSTRAINT [PK_tag] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [UQ_tag_name] UNIQUE NONCLUSTERED ([tenant] ASC, [name] ASC),
    CONSTRAINT [FK_tag_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
