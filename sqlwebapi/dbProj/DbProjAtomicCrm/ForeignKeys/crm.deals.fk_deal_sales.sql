ALTER TABLE [crm].[deals] ADD CONSTRAINT [FK_deal_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id]);
