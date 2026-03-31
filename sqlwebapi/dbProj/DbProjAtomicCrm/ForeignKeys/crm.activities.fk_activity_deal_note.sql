ALTER TABLE [crm].[activities] ADD CONSTRAINT [FK_activity_deal_note] FOREIGN KEY ([deal_note_id]) REFERENCES [crm].[deal_notes] ([id]);
