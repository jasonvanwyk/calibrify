#!/bin/bash

# ============================================================================
# File Path: setup.sh
# Description: Setup script for Calibrify project
# ============================================================================

# Exit on error
set -e

echo "Setting up Calibrify project..."

# Create virtual environment for backend
echo "Setting up Python virtual environment..."
python3 -m venv backend/venv
source backend/venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r backend/requirements.txt

# Create frontend directory and initialize React app
echo "Setting up frontend..."
mkdir -p frontend/src/components frontend/src/pages frontend/src/services
cd frontend
npm install

# Create .env file from template
echo "Creating .env file..."
cd ..
cp .env.example .env

echo "Setup complete! To start the application:"
echo "1. Edit .env with your configuration"
echo "2. Run 'docker-compose up --build'" 