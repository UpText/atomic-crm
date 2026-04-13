ALTER TABLE [crm].[contacts] ADD CONSTRAINT [FK_contact_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id]);
