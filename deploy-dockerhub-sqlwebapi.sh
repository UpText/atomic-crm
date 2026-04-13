#!/bin/sh
set -eu

IMAGE_NAME="${IMAGE_NAME:-uptext/upcrm}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
EXPECTED_BRANCH="${EXPECTED_BRANCH:-sqlwebapi}"
DOCKER_PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

if ! command -v git >/dev/null 2>&1; then
  echo "Error: git is required." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is required." >&2
  exit 1
fi

cd "$SCRIPT_DIR"

CURRENT_BRANCH=$(git branch --show-current)

if [ "$CURRENT_BRANCH" != "$EXPECTED_BRANCH" ]; then
  echo "Error: this script must be run from branch '$EXPECTED_BRANCH'." >&2
  echo "Current branch: '$CURRENT_BRANCH'" >&2
  echo "Tip: override with EXPECTED_BRANCH=<branch> if needed." >&2
  exit 1
fi

if ! git diff --quiet --ignore-submodules HEAD --; then
  echo "Warning: you have uncommitted changes on '$CURRENT_BRANCH'." >&2
  printf "Continue anyway? [y/N] "
  read -r reply
  case "$reply" in
    y|Y|yes|YES)
      ;;
    *)
      echo "Aborted."
      exit 1
      ;;
  esac
fi

FULL_IMAGE_TAG="$IMAGE_NAME:$IMAGE_TAG"
VERSION_TAG="${VERSION_TAG:-$(date -u +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)}"
FULL_VERSION_TAG="$IMAGE_NAME:$VERSION_TAG"

echo "Building $FULL_IMAGE_TAG and $FULL_VERSION_TAG from Dockerfile.sqlwebapi..."
docker build --pull --platform "$DOCKER_PLATFORM" -f Dockerfile.sqlwebapi \
  -t "$FULL_IMAGE_TAG" \
  -t "$FULL_VERSION_TAG" \
  .

echo "Pushing $FULL_IMAGE_TAG to Docker Hub..."
docker push "$FULL_IMAGE_TAG"

echo "Pushing $FULL_VERSION_TAG to Docker Hub..."
docker push "$FULL_VERSION_TAG"

echo "Done: pushed $FULL_IMAGE_TAG and $FULL_VERSION_TAG"
