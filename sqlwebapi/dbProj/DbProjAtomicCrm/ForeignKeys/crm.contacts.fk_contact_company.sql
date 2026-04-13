ALTER TABLE [crm].[contacts] ADD CONSTRAINT [FK_contact_company] FOREIGN KEY ([company_id]) REFERENCES [crm].[companies] ([id]);
