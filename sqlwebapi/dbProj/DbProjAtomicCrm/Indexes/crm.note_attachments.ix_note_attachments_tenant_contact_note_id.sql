CREATE NONCLUSTERED INDEX [IX_note_attachments_tenant_contact_note_id]
    ON [crm].[note_attachments] ([tenant] ASC, [contact_note_id] ASC, [id] ASC)
    WHERE [contact_note_id] IS NOT NULL;
