ALTER TABLE [crm].[tasks] ADD CONSTRAINT [FK_task_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id]);
