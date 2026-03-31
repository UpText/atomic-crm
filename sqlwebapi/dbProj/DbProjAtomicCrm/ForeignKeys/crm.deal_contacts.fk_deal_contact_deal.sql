ALTER TABLE [crm].[deal_contacts] ADD CONSTRAINT [FK_deal_contact_deal] FOREIGN KEY ([deal_id]) REFERENCES [crm].[deals] ([id]) ON DELETE CASCADE;
