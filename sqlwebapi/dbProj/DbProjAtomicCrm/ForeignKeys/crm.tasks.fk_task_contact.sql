ALTER TABLE [crm].[tasks] ADD CONSTRAINT [FK_task_contact] FOREIGN KEY ([contact_id]) REFERENCES [crm].[contacts] ([id]) ON DELETE CASCADE;
