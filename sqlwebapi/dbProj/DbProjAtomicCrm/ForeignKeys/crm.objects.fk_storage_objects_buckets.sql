ALTER TABLE [crm].[objects] ADD CONSTRAINT [FK_storage_objects_buckets] FOREIGN KEY ([tenant], [bucket_id]) REFERENCES [crm].[buckets] ([tenant], [bucket_id]);
