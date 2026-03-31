CREATE TABLE [crm].[contact_tags] (
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_contact_tags_tenant] DEFAULT ('default'),
    [contact_id] [int] NOT NULL,
    [tag_id] [int] NOT NULL,
    CONSTRAINT [PK_contact_tag] PRIMARY KEY CLUSTERED ([contact_id] ASC, [tag_id] ASC),
    CONSTRAINT [FK_contact_tag_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
