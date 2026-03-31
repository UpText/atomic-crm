ALTER TABLE [crm].[note_attachments] ADD CONSTRAINT [FK_note_attachment_deal_note] FOREIGN KEY ([deal_note_id]) REFERENCES [crm].[deal_notes] ([id]) ON DELETE CASCADE;
