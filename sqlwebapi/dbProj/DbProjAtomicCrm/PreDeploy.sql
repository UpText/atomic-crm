IF OBJECT_ID(N'[crm].[contact_tags]', N'U') IS NOT NULL
   AND OBJECT_ID(N'[crm].[contacts]', N'U') IS NOT NULL
   AND OBJECT_ID(N'[crm].[tags]', N'U') IS NOT NULL
BEGIN
    -- Clean up legacy orphan rows before DACPAC constraint validation re-runs.
    DELETE ct
    FROM [crm].[contact_tags] AS ct
    LEFT JOIN [crm].[contacts] AS c
        ON c.[id] = ct.[contact_id]
    LEFT JOIN [crm].[tags] AS t
        ON t.[id] = ct.[tag_id]
    WHERE c.[id] IS NULL
       OR t.[id] IS NULL;
END;
