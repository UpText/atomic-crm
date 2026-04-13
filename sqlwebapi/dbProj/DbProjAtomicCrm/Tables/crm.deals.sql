CREATE TABLE [crm].[deals] (
    [id] [int] IDENTITY(1,1) NOT NULL,
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_deals_tenant] DEFAULT ('default'),
    [name] [nvarchar](200) NOT NULL,
    [company_id] [int] NOT NULL,
    [category] [nvarchar](80) NOT NULL,
    [stage] [nvarchar](80) NOT NULL,
    [description] [nvarchar](MAX) NOT NULL,
    [amount] [decimal](18,2) NOT NULL,
    [created_at] [datetime2](0) NOT NULL,
    [updated_at] [datetime2](0) NOT NULL,
    [archived_at] [datetime2](0) NULL,
    [expected_closing_date] [date] NOT NULL,
    [sales_id] [int] NOT NULL,
    [index] [int] NOT NULL,
    CONSTRAINT [PK_deal] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_deal_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
