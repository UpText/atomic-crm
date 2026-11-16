"""Validate configuration authorization in a fresh disposable local database."""
from pathlib import Path
import argparse,subprocess,uuid
parser=argparse.ArgumentParser();parser.add_argument('--container',required=True);args=parser.parse_args()
root=Path(__file__).resolve().parents[1]/'dbProj/DbProjAtomicCrm'
database='UpTextConfigAuthTest_'+uuid.uuid4().hex
command=['docker','exec','-i',args.container,'/bin/bash','-c','SQLCMDPASSWORD="${MSSQL_SA_PASSWORD:-$SA_PASSWORD}" /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b -r1']
def execute(sql):
 result=subprocess.run(command,input=sql,capture_output=True,text=True)
 if result.returncode: raise RuntimeError(result.stdout+result.stderr)
try:
 execute(f'CREATE DATABASE [{database}];\nGO\n')
 sql=f'USE [{database}];\nGO\nCREATE SCHEMA crm;\nGO\nCREATE SCHEMA crmapi;\nGO\n'
 for path in ['Tables/crm.tenants.sql','Tables/crm.sales.sql','Tables/crm.configuration.sql','StoredProcedures/crmapi.configuration_put.sql']:
  sql+=(root/path).read_text()+'\nGO\n'
 sql+='''INSERT crm.tenants(name) VALUES('a'),('b'),('inactive');
UPDATE crm.tenants SET active=0 WHERE name='inactive';
INSERT crm.sales(tenant,email,administrator,disabled) VALUES
 ('a','admin@a.test',1,0),('a','user@a.test',0,0),('b','admin@b.test',1,0),
 ('a','disabled@a.test',1,1),('inactive','admin@inactive.test',1,0);
INSERT crm.configuration(tenant,id,config) VALUES ('a',1,N'{"title":"A"}'),('b',1,N'{"title":"B"}'),('inactive',1,N'{"title":"Inactive"}');
GO
DECLARE @status int;
EXEC @status=crmapi.configuration_put @ID='1',@config=N'{}',@auth_email='admin@a.test',@auth_id=NULL,@auth_tenant='a';
IF @status<>403 THROW 50999,'Missing authenticated user accepted.',1;
EXEC @status=crmapi.configuration_put @ID='1',@config=N'{}',@auth_email='admin@a.test',@auth_id=1,@auth_tenant=NULL;
IF @status<>403 THROW 50999,'Missing authenticated tenant accepted.',1;
EXEC @status=crmapi.configuration_put @ID='1',@config=N'{}',@auth_email='admin@a.test',@auth_id=2,@auth_tenant='a';
IF @status<>403 THROW 50999,'Non-admin with administrator email accepted.',1;
EXEC @status=crmapi.configuration_put @ID='1',@config=N'{}',@auth_email='admin@b.test',@auth_id=1,@auth_tenant='b';
IF @status<>403 THROW 50999,'Cross-tenant user accepted.',1;
EXEC @status=crmapi.configuration_put @ID='1',@config=N'{}',@auth_email='disabled@a.test',@auth_id=4,@auth_tenant='a';
IF @status<>403 THROW 50999,'Disabled administrator accepted.',1;
EXEC @status=crmapi.configuration_put @ID='1',@config=N'{}',@auth_email='admin@inactive.test',@auth_id=5,@auth_tenant='inactive';
IF @status<>403 THROW 50999,'Inactive tenant accepted.',1;
IF EXISTS(SELECT 1 FROM crm.configuration WHERE (tenant='a' AND JSON_VALUE(config,'$.title')<>'A') OR (tenant='b' AND JSON_VALUE(config,'$.title')<>'B') OR (tenant='inactive' AND JSON_VALUE(config,'$.title')<>'Inactive'))
 THROW 50999,'Denied write changed tenant configuration.',1;
EXEC @status=crmapi.configuration_put @ID='bad',@config=N'{}',@auth_email='admin@a.test',@auth_id=1,@auth_tenant='a';
IF @status<>400 THROW 50999,'Invalid configuration ID accepted.',1;
EXEC @status=crmapi.configuration_put @ID='1',@config=N'not json',@auth_email='admin@a.test',@auth_id=1,@auth_tenant='a';
IF @status<>400 THROW 50999,'Invalid JSON accepted.',1;
EXEC @status=crmapi.configuration_put @ID='1',@config=N'{"title":"Updated A"}',@auth_email='stale-email@test',@auth_id=1,@auth_tenant='a';
IF @status<>200 THROW 50999,'Authorized administrator denied.',1;
IF NOT EXISTS(SELECT 1 FROM crm.configuration WHERE tenant='a' AND JSON_VALUE(config,'$.title')='Updated A' AND updated_by='admin@a.test')
 THROW 50999,'Authorized configuration update or authoritative audit identity failed.',1;
IF NOT EXISTS(SELECT 1 FROM crm.configuration WHERE tenant='b' AND JSON_VALUE(config,'$.title')='B') THROW 50999,'Other tenant modified.',1;
UPDATE crm.sales SET administrator=0 WHERE id=1;
EXEC @status=crmapi.configuration_put @ID='1',@config=N'{}',@auth_email='admin@a.test',@auth_id=1,@auth_tenant='a';
IF @status<>403 THROW 50999,'Revoked administrator retained configuration access.',1;
'''
 execute(sql)
 print('PASS: authenticated membership, tenant isolation, admin-only writes, disabled/revoked users, inactive tenants, denied-write integrity, valid updates and authoritative audit identity.')
finally:
 execute(f'USE master;\nGO\nALTER DATABASE [{database}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;\nDROP DATABASE [{database}];\nGO\n')
