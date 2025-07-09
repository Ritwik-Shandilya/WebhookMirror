#!/usr/bin/env bash
set -euo pipefail

# Install Ruby gems for the backend
cd "$(dirname "$0")/.."/backend
bundle install

# Install Node packages for the frontend
cd ../frontend
yarn install

# Additional peer dependencies required by @bigbinary/neetoui
# Pin versions to match the library peerDependencies
PACKAGES=(
  "@bigbinary/neeto-cist@1.0.3"
  "@bigbinary/neeto-commons-frontend@latest"
  "@bigbinary/neeto-datepicker@^1.0.4"
  "@bigbinary/neeto-hotkeys@1.0.4"
  "@wojtekmaj/react-timerange-picker@5.5.0"
  "antd@5.9.2"
  "avvvatars-react@0.4.2"
  "classnames@2.2.1"
  "dayjs@1.11.10"
  "formik@2.2.0"
  "framer-motion@11.2.14"
  "i18next@21.7.0"
  "linkify-react@4.1.2"
  "linkifyjs@4.1.2"
  "qs@^6.11.2"
  "ramda@^0.29.0"
  "react-colorful@5.6.1"
  "react-drag-listview@2.0.0"
  "react-helmet@6.1.0"
  "react-i18next@11.16.8"
  "react-resizable@3.0.4"
  "react-router-dom@5.3.3"
  "react-time-picker@6.5.2"
  "yup@0.32.11"
  "zustand@4.3.2"
  "js-logger"
  "sass"
  "shakapacker"
  "tailwindcss"
  "util"
  "uuid"
  "webpack"
)

# Install all extra packages in a single command
if [ "${#PACKAGES[@]}" -gt 0 ]; then
  yarn add "${PACKAGES[@]}"
fi

# Build the frontend to verify dependencies
yarn build

cd ..
echo "Dependencies installed successfully."
