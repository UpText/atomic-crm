CREATE TABLE [crm].[objects] (
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_objects_tenant] DEFAULT ('default'),
    [bucket_id] [nvarchar](128) NOT NULL,
    [object_path] [nvarchar](1024) NOT NULL,
    [content_type] [nvarchar](255) NULL,
    [bytes_length] [bigint] NOT NULL,
    [sha256_hex] [char](64) NULL,
    [created_at] [datetime2](3) NOT NULL CONSTRAINT [DF_objects_created_at] DEFAULT (sysutcdatetime()),
    [updated_at] [datetime2](3) NOT NULL CONSTRAINT [DF_objects_updated_at] DEFAULT (sysutcdatetime()),
    [data] [varbinary](MAX) NOT NULL,
    CONSTRAINT [PK_storage_objects] PRIMARY KEY CLUSTERED ([tenant] ASC, [bucket_id] ASC, [object_path] ASC),
    CONSTRAINT [FK_objects_tenant_bucket] FOREIGN KEY ([tenant], [bucket_id]) REFERENCES [crm].[buckets] ([tenant], [bucket_id])
);
