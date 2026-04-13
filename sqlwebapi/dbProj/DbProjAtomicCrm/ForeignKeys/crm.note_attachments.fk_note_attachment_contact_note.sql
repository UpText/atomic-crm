ALTER TABLE [crm].[note_attachments] ADD CONSTRAINT [FK_note_attachment_contact_note] FOREIGN KEY ([contact_note_id]) REFERENCES [crm].[contact_notes] ([id]) ON DELETE CASCADE;
