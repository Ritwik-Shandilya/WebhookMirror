#!/usr/bin/env bash
set -e

# Start Rails server from the backend directory.
cd backend
bundle exec rails server
