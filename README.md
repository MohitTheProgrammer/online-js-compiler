# Code Sync

Code Sync is a real-time collaborative JavaScript editor built with React,
Vite, Express, and Socket.IO.

## Local development

Run `npm run dev` to start the Vite client and Socket.IO server together. Open
`http://localhost:5173`; Vite proxies Socket.IO traffic to the local server on
port 4501, including if Vite selects another port. Press Ctrl+C to stop both
processes.

## Deployment

Run `npm run build` and then `npm start` to serve the production build. The
server uses the `PORT` value provided by the host, or port 4501 locally.

When the client and server are on different origins, configure
`VITE_SOCKET_URL` as the server URL when building the client, and `CLIENT_URL`
as the client URL for the server's Socket.IO CORS setting. For a same-origin
deployment, the client uses the current site origin automatically.
