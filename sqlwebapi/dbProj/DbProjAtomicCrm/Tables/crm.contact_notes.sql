CREATE TABLE [crm].[contact_notes] (
    [id] [int] IDENTITY(1,1) NOT NULL,
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_contact_notes_tenant] DEFAULT ('default'),
    [contact_id] [int] NOT NULL,
    [sales_id] [int] NOT NULL,
    [date] [datetime2](0) NOT NULL,
    [text] [nvarchar](MAX) NOT NULL,
    [status] [nvarchar](50) NOT NULL,
    CONSTRAINT [PK_contact_note] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_contact_note_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
