ALTER TABLE [crm].[deals] ADD CONSTRAINT [FK_deal_company] FOREIGN KEY ([company_id]) REFERENCES [crm].[companies] ([id]);
