CREATE NONCLUSTERED INDEX [IX_note_attachments_tenant_deal_note_id]
    ON [crm].[note_attachments] ([tenant] ASC, [deal_note_id] ASC, [id] ASC)
    WHERE [deal_note_id] IS NOT NULL;
