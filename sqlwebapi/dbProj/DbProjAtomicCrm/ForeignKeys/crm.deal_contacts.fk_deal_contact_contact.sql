ALTER TABLE [crm].[deal_contacts] ADD CONSTRAINT [FK_deal_contact_contact] FOREIGN KEY ([contact_id]) REFERENCES [crm].[contacts] ([id]) ON DELETE CASCADE;
