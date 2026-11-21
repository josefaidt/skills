#!/bin/bash
# The oracle posts the expected review, so a run with `-a oracle` checks that the verifier scores it 1.
mkdir -p /pr
cp "$(dirname "$0")/review.md" /pr/review.md
