# Server-Sent Events (SSE) Demo (Node.js)

Small demo project that shows how server send real-time updates to client using **Server-Sent Events (SSE)**.

SSE is a simple way for a server to push live updates to the browser over a single HTTP connection (one-way: server to client). It is useful when the client mainly needs to receive data, such as live notifications, activity feeds, dashboard metrics, stock/news tickers, and background job status updates.

## Tech Stack

- **Backend:** Node.js, Express, CORS
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Protocol:** Server-Sent Events over HTTP

## Run Locally

1. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

2. Start server:
   ```bash
   npm start
   ```
   Server runs at `http://localhost:5000`.

3. Open client:
   - Open `client/index.html` in your browser (or serve `client/` with any static server).
   - The app connects to `http://localhost:5000/events`.

## How to Test

- After opening the client, check status at top:
  - `Connected` means SSE stream is active.
- You should see a new notification every ~2 seconds.
- Open browser DevTools Console:
  - You should see `Received:` logs for incoming events.
- Stop the server:
  - Client status should become `Disconnected`.
- Restart the server and refresh browser:
  - Events should resume.
