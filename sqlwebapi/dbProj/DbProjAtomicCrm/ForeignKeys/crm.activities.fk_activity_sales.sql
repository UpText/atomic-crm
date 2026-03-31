ALTER TABLE [crm].[activities] ADD CONSTRAINT [FK_activity_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id]);
