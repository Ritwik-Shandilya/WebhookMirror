#!/usr/bin/env bash
set -e

# Ensure Bundler and gems are installed before starting the Rails server.
if ! command -v ruby >/dev/null 2>&1; then
  echo "Ruby not found; installing..."
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -y && apt-get install -y ruby-full
  else
    echo "Package manager not found. Please install Ruby manually." >&2
    exit 1
  fi
fi

if ! command -v bundle >/dev/null 2>&1; then
  echo "Bundler not found; installing..."
  gem install --no-document bundler
fi

cd backend

# Install gems if they are missing
bundle check || bundle install --jobs 4 --retry 3

bundle exec rails server
