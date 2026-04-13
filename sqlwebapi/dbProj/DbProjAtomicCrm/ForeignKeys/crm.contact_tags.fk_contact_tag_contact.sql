ALTER TABLE [crm].[contact_tags] ADD CONSTRAINT [FK_contact_tag_contact] FOREIGN KEY ([contact_id]) REFERENCES [crm].[contacts] ([id]) ON DELETE CASCADE;
