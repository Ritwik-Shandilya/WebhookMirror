# WebhookMirror

![WebhookMirror logo](assets/webhookmirror-logo.svg)

This project aims to be a production ready replica of [Webhook.site](https://webhook.site). It contains a Ruby on Rails API backend and a React + TypeScript frontend built with Vite.

Refer to `workflow.md` for the ongoing development notes and checklist derived from the Product Requirements Document.

## Features

- Sidebar navigation with quick access to **Start Testing**, **Dashboard** and **API Tester**
- Export captured requests to JSON
- Clear all requests for an endpoint
- Copy any request as a cURL command

## How it works

1. Create a new endpoint from the homepage.
2. Send HTTP requests to that endpoint using your service or `curl`.
3. Inspect the captured requests in the dashboard.

### Example curl command

```bash
curl -X POST http://localhost:3000/<endpoint-id> \
     -H "Content-Type: application/json" \
     -d '{"hello":"world"}'
```

## Running the application

The backend and frontend are developed separately in development and are deployed as independent services in production. Ensure you have **Ruby** (version 3.0 or higher) and **Node.js** (version 18 or higher) installed on your machine.

### 1. Start the Rails API backend (development)

```bash
bundle install        # install Ruby gems
bin/rails db:setup    # create and migrate the database
bin/dev               # start the Rails server on http://localhost:3000
```

### 2. Start the React frontend (development)

Open a new terminal and run:

```bash
cd frontend
npm install           # install JavaScript dependencies
npm run dev           # start Vite dev server on http://localhost:5173
```

With both servers running you can browse to `http://localhost:5173` to use the application while it interacts with the Rails API running on port 3000.

### Building for production

Build the React frontend as a static site:

```bash
cd frontend
npm install
npm run build
```

Deploy the contents of `frontend/dist` to your static hosting service.

Deploy the Rails API separately. The service should run `bundle install` during
build and start with:

```bash
bundle exec puma -C config/puma.rb
```

Run database migrations in a release phase using:

```bash
bundle exec rake db:migrate
```

When deploying to platforms like **Render** or **Railway**, configure two
separate services:

1. **Static Site**
   - Root directory: `frontend/`
   - Build command: `npm install && npm run build`
   - Publish directory: `frontend/dist`
2. **Rails API**
   - Root directory: `.`
   - Build command: `bundle install`
   - Start command: `bundle exec puma -C config/puma.rb`
   - Release command: `bundle exec rake db:migrate`

When using NeetoDeploy set `NEETO_DEPLOY_PROCESS_TYPE` to:
```json
{
  "release": "bundle exec rake db:migrate",
  "web": "bundle exec puma -C config/puma.rb"
}
```


The UI follows [Neetix](https://neetix.neetokb.com/) best practices such as using sentence case and clear loading states.

### Generating a capture URL

1. Visit the homepage and click **Create Endpoint**.
2. A unique URL containing a UUID will be generated, for example `http://localhost:5173/endpoint/abcd-1234`.
3. Send any HTTP request to this URL using `curl` or your integration. The Rails API will store the payload.
   For example:
   ```bash
   curl -X POST http://localhost:3000/<uuid> \
        -H "Content-Type: application/json" \
        -d '{"sample":"data"}'
   ```
4. Open the URL in your browser to see the list of requests as they arrive. Click a request to view its full details.

### Sending test requests

Use `curl` to hit your generated URL. Replace `<uuid>` with the value shown in the UI:

```bash
# POST with JSON body
curl -X POST http://localhost:3000/<uuid> \
     -H "Content-Type: application/json" \
     -d '{"hello": "world"}'

# Simple GET
curl http://localhost:3000/<uuid>
```

### API testing from the UI

Navigate to `/api-test` in the frontend to open the **API Tester**. Enter the inbox URL you wish to target and customize the HTTP method, query parameters, headers and body. The response status, headers and body are shown instantly so you can simulate webhook calls without third-party tools.

### Inspecting requests

* After sending requests, open the generated endpoint page in your browser.
* The list of captured requests appears. Click any entry to view full headers and body.
* Use these details to debug your webhook integrations.
