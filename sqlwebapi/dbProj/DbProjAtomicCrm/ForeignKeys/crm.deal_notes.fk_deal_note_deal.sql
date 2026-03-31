ALTER TABLE [crm].[deal_notes] ADD CONSTRAINT [FK_deal_note_deal] FOREIGN KEY ([deal_id]) REFERENCES [crm].[deals] ([id]) ON DELETE CASCADE;
