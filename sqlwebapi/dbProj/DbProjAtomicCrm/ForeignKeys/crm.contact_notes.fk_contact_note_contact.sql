ALTER TABLE [crm].[contact_notes] ADD CONSTRAINT [FK_contact_note_contact] FOREIGN KEY ([contact_id]) REFERENCES [crm].[contacts] ([id]) ON DELETE CASCADE;
