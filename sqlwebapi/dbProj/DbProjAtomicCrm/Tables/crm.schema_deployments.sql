CREATE TABLE [crm].[schema_deployments]
(
    [id] INT IDENTITY(1,1) NOT NULL,
    [version] NVARCHAR(128) NOT NULL,
    [git_commit] NVARCHAR(64) NULL,
    [deployed_by] NVARCHAR(128) NULL,
    [deployment_target] NVARCHAR(128) NULL,
    [deployed_at] DATETIME2(0) NOT NULL
        CONSTRAINT [DF_crm_schema_deployments_deployed_at] DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT [PK_crm_schema_deployments] PRIMARY KEY CLUSTERED ([id] ASC)
);
