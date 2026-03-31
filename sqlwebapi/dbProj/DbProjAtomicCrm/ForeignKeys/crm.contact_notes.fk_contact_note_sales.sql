ALTER TABLE [crm].[contact_notes] ADD CONSTRAINT [FK_contact_note_sales] FOREIGN KEY ([sales_id]) REFERENCES [crm].[sales] ([id]);
