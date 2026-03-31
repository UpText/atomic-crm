ALTER TABLE [crm].[activities] ADD CONSTRAINT [FK_activity_deal] FOREIGN KEY ([deal_id]) REFERENCES [crm].[deals] ([id]);
