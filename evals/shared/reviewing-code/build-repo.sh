#!/bin/sh
# Builds the repository under review: `base/` committed on `main`, then `branch/` laid over it and
# committed on `feature`, which stays checked out. The pull request body goes to /pr/body.md.
set -eu
FIXTURE="${FIXTURE:-/fixture}"
APP="${APP:-/app}"
PR="${PR:-/pr}"

commit() {
  git -C "$APP" add -A
  git -C "$APP" -c user.name=Maintainer -c user.email=maintainer@example.com commit -q -m "$1"
}

mkdir -p "$APP" "$PR"
cp -R "$FIXTURE/base/." "$APP"
git -C "$APP" init -q -b main
commit "chore: password reset service"
git -C "$APP" checkout -q -b feature
cp -R "$FIXTURE/branch/." "$APP"
commit "$(head -n 1 "$FIXTURE/pr-body.md" | sed 's/^# //')"
cp "$FIXTURE/pr-body.md" "$PR/body.md"
rm -rf "$FIXTURE"
