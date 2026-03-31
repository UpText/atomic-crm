CREATE TABLE [crm].[activities] (
    [id] [int] IDENTITY(1,1) NOT NULL,
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_activities_tenant] DEFAULT ('default'),
    [type] [nvarchar](50) NOT NULL,
    [date] [datetime2](0) NOT NULL,
    [sales_id] [int] NULL,
    [company_id] [int] NULL,
    [contact_id] [int] NULL,
    [contact_note_id] [int] NULL,
    [deal_id] [int] NULL,
    [deal_note_id] [int] NULL,
    CONSTRAINT [PK_activity] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_activity_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
