ALTER TABLE [crm].[activities] ADD CONSTRAINT [FK_activity_company] FOREIGN KEY ([company_id]) REFERENCES [crm].[companies] ([id]);
