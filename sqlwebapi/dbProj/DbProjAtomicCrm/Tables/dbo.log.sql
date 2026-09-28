CREATE TABLE [dbo].[log] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [ApiName]         NVARCHAR (MAX) NULL,
    [SwaServer]       NVARCHAR (MAX) NULL,
    [MsUsed]          INT            NULL,
    [TimeStamp]       DATETIME       DEFAULT (getdate()) NULL,
    [ReturnValue]     INT            NULL,
    [RequestBody]     NVARCHAR (MAX) NULL,
    [ReturnBody]      NVARCHAR (MAX) NULL,
    [ExecString]      NVARCHAR (MAX) NULL,
    [jwt]             NVARCHAR (MAX) NULL,
    [UnexpectedError] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_log] PRIMARY KEY CLUSTERED ([Id] ASC)
);
