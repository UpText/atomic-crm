ALTER TABLE [crm].[activities] ADD CONSTRAINT [FK_activity_contact] FOREIGN KEY ([contact_id]) REFERENCES [crm].[contacts] ([id]);
