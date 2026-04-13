ALTER TABLE [crm].[deal_notes] ADD CONSTRAINT [FK_deal_note_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id]);
