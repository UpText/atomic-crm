CREATE TABLE [crm].[buckets] (
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_buckets_tenant] DEFAULT ('default'),
    [bucket_id] [nvarchar](128) NOT NULL,
    [is_public] [bit] NOT NULL CONSTRAINT [DF_buckets_is_public] DEFAULT ((0)),
    [created_at] [datetime2](3) NOT NULL CONSTRAINT [DF_buckets_created_at] DEFAULT (sysutcdatetime()),
    CONSTRAINT [PK__buckets__6F24769B1628DE1C] PRIMARY KEY CLUSTERED ([tenant] ASC, [bucket_id] ASC),
    CONSTRAINT [FK_buckets_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
