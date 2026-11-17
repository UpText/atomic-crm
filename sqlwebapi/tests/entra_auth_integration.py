"""Exercise Entra provisioning in a new, disposable local SQL database.

Requires an existing local SQL Server container. No existing database is modified.
Usage: python3 entra_auth_integration.py --container upapi-sqlserver
"""
import argparse
from pathlib import Path
import subprocess
import uuid

parser=argparse.ArgumentParser()
parser.add_argument('--container',required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]/'dbProj/DbProjAtomicCrm'
database='UpTextEntraTest_'+uuid.uuid4().hex
command=['docker','exec','-i',args.container,'/bin/bash','-c',
 'SQLCMDPASSWORD="${MSSQL_SA_PASSWORD:-$SA_PASSWORD}" /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b -r1']
def execute(sql):
 result=subprocess.run(command,input=sql,text=True,capture_output=True)
 if result.returncode: raise RuntimeError(result.stdout+result.stderr)
 return result.stdout

def deny(sql, number):
 return f'''BEGIN TRY
{sql}
THROW 50999,'Expected authentication denial.',1;
END TRY
BEGIN CATCH
 IF XACT_STATE()<>0 ROLLBACK;
 IF ERROR_NUMBER()<>{number} THROW;
END CATCH;
GO
'''

try:
 execute(f'CREATE DATABASE [{database}];\nGO\n')
 ddl=f'USE [{database}];\nGO\nCREATE SCHEMA crm;\nGO\nCREATE SCHEMA crmapi;\nGO\n'
 files=['Schemas/crmauth.sql','Tables/crm.tenants.sql','Tables/crm.sales.sql','Tables/crm.configuration.sql','Tables/crm.external_identities.sql']
 files += [str(p.relative_to(root)) for p in sorted((root/'StoredProcedures').glob('crmauth.*.sql'))]
 files += ['StoredProcedures/crmapi.configuration_put.sql','StoredProcedures/crmapi.sales_get.sql','StoredProcedures/crmapi.sales_post.sql','StoredProcedures/crmapi.sales_put.sql']
 for path in files: ddl+=(root/path).read_text()+'\nGO\n'
 execute(ddl)
 directory='11111111-1111-1111-1111-111111111111'; client='22222222-2222-2222-2222-222222222222'; oid='33333333-3333-3333-3333-333333333333'
 config='{"authentication":{"entra":{"enabled":true,"directoryId":"'+directory+'","clientId":"'+client+'"}}}'
 setup=f'''USE [{database}];
GO
INSERT crm.tenants(name) VALUES ('a'),('b');
INSERT crm.configuration(tenant,id,config) VALUES ('a',1,'{config}'),('b',1,'{config}');
INSERT crm.sales(tenant,email,administrator) VALUES ('a','admin@a.test',1),('a','user@a.test',0),('b','admin@b.test',1);
GO
'''
 resolve=f"EXEC crmauth.login_resolve @tenant='a',@directoryId='{directory}',@clientId='{client}',@objectId='{oid}',@email='invite@a.test',@firstName=N'Jane Marie',@lastName=N'Doe-Smith';"
 setup+=deny(resolve,50006)
 setup+=deny(f"EXEC crmauth.invite_post @tenant='a',@actor=2,@objectId='{oid}',@email='invite@a.test',@firstName=N'Jane Marie',@lastName=N'Doe-Smith';",50001)
 setup+=deny(f"EXEC crmauth.invite_post @tenant='a',@actor=1,@objectId='{oid}',@email='admin@b.test',@salesId=3;",50003)
 setup+=f"EXEC crmauth.invite_post @tenant='a',@actor=1,@objectId='{oid}',@email='invite@a.test';\nGO\n"
 setup+=deny(resolve.replace(directory,'99999999-9999-9999-9999-999999999999'),50005)
 setup+=deny(resolve.replace("@tenant='a'","@tenant='b'"),50006)
 setup+='''UPDATE crm.external_identities SET expires_at=DATEADD(day,-1,SYSUTCDATETIME());
GO
'''+deny(resolve,50006)+'''UPDATE crm.external_identities SET expires_at=DATEADD(day,1,SYSUTCDATETIME());
GO
'''+resolve+f'''
GO
IF NOT EXISTS (SELECT 1 FROM crm.sales WHERE tenant='a' AND email='invite@a.test' AND first_name=N'Jane Marie' AND last_name=N'Doe-Smith') THROW 50999,'Invited user names were not populated.',1;
IF (SELECT COUNT(*) FROM crm.external_identities WHERE activated_at IS NOT NULL)<>1 THROW 50999,'Invitation not activated.',1;
IF EXISTS (SELECT 1 FROM crm.sales WHERE email='invite@a.test' AND (administrator=1 OR PasswordHash IS NOT NULL)) THROW 50999,'External user has excess credentials/privileges.',1;
GO
EXEC crmauth.identity_revoke @tenant='a',@actor=1,@objectId='{oid}',@directoryId='{directory}';
GO
'''+deny(resolve,50006)
 setup+='''UPDATE crm.configuration SET config=JSON_MODIFY(config,'$.authentication.entra.provisioningMode','automatic') WHERE tenant='a';
GO
'''+deny(resolve,50006)
 setup+=resolve.replace(oid,'44444444-4444-4444-4444-444444444444').replace('invite@a.test','auto@a.test')+'\nGO\n'
 setup+='''IF NOT EXISTS (SELECT 1 FROM crm.sales WHERE tenant='a' AND email='auto@a.test' AND first_name=N'Jane Marie' AND last_name=N'Doe-Smith') THROW 50999,'Automatic user names missing.',1;
UPDATE crm.sales SET first_name=N'Custom',last_name=N'CRM name' WHERE tenant='a' AND email='auto@a.test';
GO
'''
 setup+=resolve.replace(oid,'44444444-4444-4444-4444-444444444444').replace('invite@a.test','auto@a.test')+'\nGO\n'
 setup+='''IF NOT EXISTS (SELECT 1 FROM crm.sales WHERE tenant='a' AND email='auto@a.test' AND first_name=N'Custom' AND last_name=N'CRM name') THROW 50999,'Existing CRM names overwritten.',1;
UPDATE crm.sales SET first_name=NULL,last_name=N' ' WHERE tenant='a' AND email='auto@a.test';
GO
'''
 setup+=resolve.replace(oid,'44444444-4444-4444-4444-444444444444').replace('invite@a.test','auto@a.test')+'\nGO\n'
 setup+='''IF NOT EXISTS (SELECT 1 FROM crm.sales WHERE tenant='a' AND email='auto@a.test' AND first_name=N'Jane Marie' AND last_name=N'Doe-Smith') THROW 50999,'Blank existing names were not filled.',1;
GO
'''
 setup+=deny(resolve.replace(oid,'55555555-5555-5555-5555-555555555555').replace('invite@a.test','user@a.test'),50007)
 setup+='''IF EXISTS (SELECT 1 FROM crm.sales WHERE email='auto@a.test' AND administrator=1) THROW 50999,'Automatic user was made admin.',1;
UPDATE crm.sales SET disabled=1 WHERE email='auto@a.test';
GO
'''+deny(resolve.replace(oid,'44444444-4444-4444-4444-444444444444').replace('invite@a.test','auto@a.test'),50008)
 setup+='''DECLARE @status int;
EXEC @status=crmapi.configuration_put @ID='1',@config='{}',@auth_email='user@a.test',@auth_id=2,@auth_tenant='a';
IF @status<>403 THROW 50999,'Non-admin changed configuration.',1;
EXEC @status=crmapi.sales_put @ID='2',@administrator=1,@auth_id=2,@auth_tenant='a';
IF @status<>403 THROW 50999,'User elevated own role.',1;
EXEC @status=crmapi.sales_put @ID='2',@first_name='Profile',@auth_id=2,@auth_tenant='a';
IF @status<>200 THROW 50999,'Self-service profile edit regressed.',1;
GO
'''

 # Consent completion rechecks tenant/admin and rejects stale settings atomically.
 connection=f"EXEC crmauth.connection_post @tenant='a',@actor=1,@expectedConfig=N'{config}',@directoryId='{directory}',@clientId='{client}',@clientSecretUri='https://uptextsecrets.vault.azure.net/secrets/shared';"
 setup+=deny(connection.replace('@actor=1','@actor=2'),50001)
 setup+=deny(connection.replace('@actor=1','@actor=3'),50001)
 setup+=deny(connection,50005)  # Earlier policy edits made the snapshot stale.
 setup+=f"UPDATE crm.configuration SET config=N'{config}' WHERE tenant='a';\nGO\n"
 setup+=connection+'\nGO\n'
 setup+=f"""IF JSON_VALUE((SELECT config FROM crm.configuration WHERE tenant='a' AND id=1),'$.authentication.entra.clientSecretUri')<>'https://uptextsecrets.vault.azure.net/secrets/shared' THROW 50999,'Consent connection not saved.',1;
IF JSON_VALUE((SELECT config FROM crm.configuration WHERE tenant='a' AND id=1),'$.authentication.entra.provisioningMode')<>'invite_only' THROW 50999,'Consent default policy incorrect.',1;
IF (SELECT config FROM crm.configuration WHERE tenant='b' AND id=1)<>N'{config}' THROW 50999,'Other CRM tenant modified.',1;
IF EXISTS (SELECT 1 FROM crm.sales WHERE tenant='a' AND email<>'admin@a.test' AND administrator=1) THROW 50999,'Consent changed roles.',1;
GO
"""
 setup+=deny(connection,50005)  # A consumed snapshot cannot overwrite newer settings.
 execute(setup)
 print('PASS: invite-only default, admin authorization, cross-tenant isolation, directory validation, expiry, activation, revocation, automatic standard-user provisioning, safe account linking, disabled users, configuration authorization, role escalation self-service profile edits, Entra name creation/backfill and preservation of CRM-edited names.')
finally:
 execute(f'USE master;\nGO\nALTER DATABASE [{database}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;\nDROP DATABASE [{database}];\nGO\n')
