#!/usr/bin/env bash
set -e

# Ensure Bundler and gems are installed before starting the Rails server.
if ! command -v bundle >/dev/null 2>&1; then
  echo "Bundler not found; installing..."
  gem install --no-document bundler
fi

cd backend

# Install gems if they are missing
bundle check || bundle install --jobs 4 --retry 3

bundle exec rails server
