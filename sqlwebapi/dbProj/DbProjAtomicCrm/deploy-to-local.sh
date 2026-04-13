#!/usr/bin/env bash

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_FILE="${PROJECT_DIR}/DbProjAtomicCrm.sqlproj"
CONFIGURATION="${CONFIGURATION:-Debug}"
ENV_FILE="${PROJECT_DIR}/.env.local.deploy"
SQLPACKAGE_DIR="${PROJECT_DIR}/.sqlpackage"
SQLPACKAGE_ZIP="${PROJECT_DIR}/sqlpackage.zip"
DEPLOY_VERSION="${DEPLOY_VERSION:-$(git -C "${PROJECT_DIR}" describe --tags --always 2>/dev/null || echo manual)}"
GIT_COMMIT="${GIT_COMMIT:-$(git -C "${PROJECT_DIR}" rev-parse --short HEAD 2>/dev/null || echo unknown)}"
DEPLOYED_BY="${DEPLOYED_BY:-$(whoami 2>/dev/null || echo unknown)}"
DEPLOYMENT_TARGET="${DEPLOYMENT_TARGET:-local}"
SERVICE_USER_NAME="${SERVICE_USER_NAME:-}"
SERVICE_USER_PASSWORD="${SERVICE_USER_PASSWORD:-}"

generate_service_user_password() {
  python3 -c "import secrets, string; alphabet = string.ascii_letters + string.digits + '!@#%^*_+='; print(''.join(secrets.choice(alphabet) for _ in range(24)))"
}

if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
fi

if [[ -n "${SERVICE_USER_NAME}" && -z "${SERVICE_USER_PASSWORD}" ]]; then
  SERVICE_USER_PASSWORD="$(generate_service_user_password)"
  echo "Generated temporary password for ${SERVICE_USER_NAME}: ${SERVICE_USER_PASSWORD}"
  echo "Change this password after deployment."
fi

CONNECTION_STRING="${1:-${SQLPROJ_CONNECTION_STRING:-}}"

if [[ -z "${CONNECTION_STRING}" ]]; then
  echo "Usage: SQLPROJ_CONNECTION_STRING='<connection-string>' $0"
  echo "   or: $0 '<connection-string>'"
  exit 1
fi

if ! command -v dotnet >/dev/null 2>&1; then
  echo "dotnet is required but was not found."
  exit 1
fi

if command -v sqlpackage >/dev/null 2>&1; then
  SQLPACKAGE_BIN="$(command -v sqlpackage)"
elif [[ -x "${SQLPACKAGE_DIR}/sqlpackage" ]]; then
  SQLPACKAGE_BIN="${SQLPACKAGE_DIR}/sqlpackage"
elif [[ -f "${SQLPACKAGE_ZIP}" ]]; then
  if ! command -v unzip >/dev/null 2>&1; then
    echo "unzip is required to extract ${SQLPACKAGE_ZIP}."
    exit 1
  fi

  echo "Extracting bundled sqlpackage from ${SQLPACKAGE_ZIP}..."
  rm -rf "${SQLPACKAGE_DIR}"
  mkdir -p "${SQLPACKAGE_DIR}"
  unzip -q "${SQLPACKAGE_ZIP}" -d "${SQLPACKAGE_DIR}"
  chmod +x "${SQLPACKAGE_DIR}/sqlpackage"
  SQLPACKAGE_BIN="${SQLPACKAGE_DIR}/sqlpackage"
else
  echo "sqlpackage is required but was not found."
  echo "Install it or add ${SQLPACKAGE_ZIP}, then rerun this script."
  exit 1
fi

echo "Building DACPAC from ${PROJECT_FILE}..."
dotnet build "${PROJECT_FILE}" -c "${CONFIGURATION}"

if [[ "${CONFIGURATION}" == "Release" ]]; then
  DACPAC_FILE="${PROJECT_DIR}/bin/Release/DbProjAtomicCrm.dacpac"
else
  DACPAC_FILE="${PROJECT_DIR}/bin/Debug/DbProjAtomicCrm.dacpac"
fi

if [[ ! -f "${DACPAC_FILE}" ]]; then
  echo "DACPAC not found at ${DACPAC_FILE}"
  exit 1
fi

SQLPACKAGE_ARGS=(
  /Action:Publish
  "/SourceFile:${DACPAC_FILE}"
  "/TargetConnectionString:${CONNECTION_STRING}"
  "/v:DeployVersion=${DEPLOY_VERSION}"
  "/v:GitCommit=${GIT_COMMIT}"
  "/v:DeployedBy=${DEPLOYED_BY}"
  "/v:DeploymentTarget=${DEPLOYMENT_TARGET}"
)

if [[ -n "${SERVICE_USER_NAME}" ]]; then
  SQLPACKAGE_ARGS+=("/v:ServiceUserName=${SERVICE_USER_NAME}")
fi

if [[ -n "${SERVICE_USER_PASSWORD}" ]]; then
  SQLPACKAGE_ARGS+=("/v:ServiceUserPassword=${SERVICE_USER_PASSWORD}")
fi

echo "Publishing ${DACPAC_FILE}..."
echo "Deployment metadata: version=${DEPLOY_VERSION}, git_commit=${GIT_COMMIT}, deployed_by=${DEPLOYED_BY}, target=${DEPLOYMENT_TARGET}"
"${SQLPACKAGE_BIN}" "${SQLPACKAGE_ARGS[@]}"

echo "Deployment completed."
