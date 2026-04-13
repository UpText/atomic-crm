ALTER TABLE [crm].[companies] ADD CONSTRAINT [FK_company_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id]);
