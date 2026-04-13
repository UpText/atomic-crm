CREATE TABLE [crm].[deal_contacts] (
    [tenant] [nvarchar](255) NOT NULL CONSTRAINT [DF_deal_contacts_tenant] DEFAULT ('default'),
    [deal_id] [int] NOT NULL,
    [contact_id] [int] NOT NULL,
    CONSTRAINT [PK_deal_contact] PRIMARY KEY CLUSTERED ([deal_id] ASC, [contact_id] ASC),
    CONSTRAINT [FK_deal_contact_tenant] FOREIGN KEY ([tenant]) REFERENCES [crm].[tenants] ([name])
);
