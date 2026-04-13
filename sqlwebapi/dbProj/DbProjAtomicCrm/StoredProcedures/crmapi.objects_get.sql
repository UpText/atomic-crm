CREATE PROCEDURE [crmapi].[objects_get]
    @id NVARCHAR(128) = NULL,
    @object_path NVARCHAR(1024) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM crm.objects
        WHERE 
          bucket_id = @id
          AND object_path = @object_path
    )
    BEGIN
        RAISERROR('Object not found', 16, 1);
        RETURN 404;
    END

    SELECT content_type, data
    FROM crm.objects
    WHERE 
      bucket_id = @id
      AND object_path = @object_path;
END