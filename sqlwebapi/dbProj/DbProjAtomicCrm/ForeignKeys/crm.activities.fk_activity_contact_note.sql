ALTER TABLE [crm].[activities] ADD CONSTRAINT [FK_activity_contact_note] FOREIGN KEY ([contact_note_id]) REFERENCES [crm].[contact_notes] ([id]);
