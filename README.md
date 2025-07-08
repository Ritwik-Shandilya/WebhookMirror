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

If your Rails server runs on a different port, set `VITE_API_ORIGIN` in
`frontend/.env` so the frontend knows where to send capture requests.

With both servers running you can browse to `http://localhost:5173` to use the application while it interacts with the Rails API running on port 3000. **When sending requests to your generated URL, be sure to hit the Rails server on port `3000`.**


The UI follows [Neetix](https://neetix.neetokb.com/) best practices such as using sentence case and clear loading states.

### Generating a capture URL

1. Visit the homepage and click **Create Endpoint**.
2. A unique URL containing a UUID will be generated, for example `http://localhost:3000/abcd-1234`. Send requests to this URL.
3. Open the link shown in the UI (`/endpoint/abcd-1234`) to see captured requests as they arrive. Click any entry to view full details.

### Sending test requests

Use `curl` to hit your generated URL on port `3000`. Replace `<uuid>` with the value shown in the UI:

```bash
# POST with JSON body
curl -X POST http://localhost:3000/<uuid> \
     -H "Content-Type: application/json" \
     -d '{"hello": "world"}'

# Simple GET
curl http://localhost:3000/<uuid>
```

### Inspecting requests

* After sending requests, open the generated endpoint page in your browser.
* The list of captured requests appears. Click any entry to view full headers and body.
* Use these details to debug your webhook integrations.
