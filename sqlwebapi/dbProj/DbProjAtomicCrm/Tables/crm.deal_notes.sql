CREATE TABLE [crm].[deal_notes] (
    [id] [int] IDENTITY(1,1) NOT NULL,
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_deal_notes_tenant] DEFAULT ('default'),
    [deal_id] [int] NOT NULL,
    [sales_id] [int] NOT NULL,
    [date] [datetime2](0) NOT NULL,
    [text] [nvarchar](MAX) NOT NULL,
    CONSTRAINT [PK_deal_note] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_deal_note_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
