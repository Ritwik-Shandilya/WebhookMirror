#!/usr/bin/env bash
set -e

# Build frontend into Rails public folder
cd frontend
npm run build
cd ../backend

# Start Rails server
bundle exec rails server
