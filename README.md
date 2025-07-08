# WebhookMirror

This project aims to be a production ready replica of [Webhook.site](https://webhook.site). It contains a Ruby on Rails API backend and a React + TypeScript frontend built with Vite.

Refer to `workflow.md` for the ongoing development notes and checklist derived from the Product Requirements Document.

## Running the application

The backend and frontend are developed separately. Ensure you have **Ruby** (version 3.0 or higher) and **Node.js** (version 18 or higher) installed on your machine.

### 1. Start the Rails API backend

```bash
cd backend
bundle install        # install Ruby gems
bin/rails db:setup    # create and migrate the database
bin/dev               # start the Rails server on http://localhost:3000
```

### 2. Start the React frontend

Open a new terminal and run:

```bash
cd frontend
npm install           # install JavaScript dependencies
npm run dev           # start Vite dev server on http://localhost:5173
```

With both servers running you can browse to `http://localhost:5173` to use the application while it interacts with the Rails API running on port 3000.
