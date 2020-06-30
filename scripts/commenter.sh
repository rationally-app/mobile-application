#!/bin/bash
PULL_REQUEST_ID=$(echo $GITHUB_REF)
GITHUB_PROJECT="justussoh/mobile-application"
EXPO_PROJECT="@justussoh/rationally"
GITHUB_TOKEN=$(echo ${{ secrets.GITHUB_TOKEN }})

PUBLISH_TEXT="Published to https://exp.host/${EXPO_PROJECT}?release-channel=${PULL_REQUEST_ID}"
STORYBOOK_PUBLISH_TEXT="Published to https://exp.host/${EXPO_PROJECT}?release-channel=storybook-${PULL_REQUEST_ID}"
QR_CODE="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=exp://exp.host/${EXPO_PROJECT}?release-channel=${PULL_REQUEST_ID}"
QR_CODE_STORYBOOK="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=exp://exp.host/${EXPO_PROJECT}?release-channel=storybook-${PULL_REQUEST_ID}"

curl -X POST \
  https://{GITHUB_TOKEN}@api.github.com/repos/${GITHUB_PROJECT}/issues/${PULL_REQUEST_ID}/comments \
  -H 'Content-Type: application/json' \
  -d '{ "body": "## Application\n![Expo QR]('"$QR_CODE"')\n'"$PUBLISH_TEXT"'\n\n## Storybook\n![Expo QR]('"$QR_CODE_STORYBOOK"')\n'"$STORYBOOK_PUBLISH_TEXT"'" }'
