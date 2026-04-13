CREATE TABLE [crm].[note_attachments] (
    [id] [int] IDENTITY(1,1) NOT NULL,
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_note_attachments_tenant] DEFAULT ('default'),
    [contact_note_id] [int] NULL,
    [deal_note_id] [int] NULL,
    [src] [nvarchar](2048) NOT NULL,
    [title] [nvarchar](255) NOT NULL,
    [path] [nvarchar](1024) NULL,
    [type] [nvarchar](128) NULL,
    [created_at] [datetime2](0) NOT NULL CONSTRAINT [DF_note_attachment_created_at] DEFAULT (sysutcdatetime()),
    CONSTRAINT [PK_note_attachment] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [CK_note_attachment_one_parent] CHECK ((case when [contact_note_id] IS NULL then (0) else (1) end+case when [deal_note_id] IS NULL then (0) else (1) end)=(1)),
    CONSTRAINT [FK_note_attachment_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
