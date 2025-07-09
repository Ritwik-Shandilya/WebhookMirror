#!/usr/bin/env bash
set -euo pipefail

# Install backend gems
cd "$(dirname "$0")/backend"
if [ -f Gemfile ]; then
  echo "Installing Ruby gems..."
  bundle install
fi

# Install frontend packages
cd ../frontend
if [ -f package.json ]; then
  echo "Installing JavaScript packages..."
  yarn install
  echo "Installing peer dependencies required by neetoui..."
  yarn add \
    linkify-react@4.1.2 \
    linkifyjs@4.1.2 \
    qs@^6.11.2 \
    ramda@^0.29.0 \
    react-colorful@5.6.1 \
    react-drag-listview@2.0.0 \
    react-i18next@11.16.8 \
    react-resizable@3.0.4 \
    react-time-picker@6.5.2 \
    yup@0.32.11 \
    zustand@4.3.2 \
    @bigbinary/neeto-cist@1.0.3 \
    @bigbinary/neeto-commons-frontend@4.13.38 \
    @bigbinary/neeto-datepicker@1.0.4 \
    @bigbinary/neeto-hotkeys@1.0.4 \
    @wojtekmaj/react-timerange-picker@5.5.0 \
    antd@5.9.2 \
    avvvatars-react@0.4.2 \
    dayjs@1.11.10 \
    formik@2.2.0 \
    framer-motion@11.2.14 \
    i18next@21.7.0 \
    classnames@2.2.1 \
    react-router-dom@5.3.3 \
    react@18.2.0 \
    react-dom@18.2.0
fi

cd ..
echo "All dependencies installed."
