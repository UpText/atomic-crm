ALTER TABLE [crm].[contact_tags] ADD CONSTRAINT [FK_contact_tag_tag] FOREIGN KEY ([tag_id]) REFERENCES [crm].[tags] ([id]) ON DELETE CASCADE;
