# EmiKettik

EmiKettik is a React/Vite airline booking demo with a small Node.js API. The API stores demo bookings and support requests in `server/store.json`; that local data file is created automatically and is excluded from Git.

## Run locally

Use two terminals in this folder:

1. Start the API: `npm run backend`
2. Start the web app: `npm run dev`

Open the URL Vite prints (usually `http://localhost:5173`). Vite proxies `/api` requests to the API on port 3001. Set `API_PORT` to use another backend port.

To open the site on a phone, keep both terminals running and connect the phone to the same Wi-Fi network as the computer. Find the computer's IPv4 address with `ipconfig`, then open `http://<computer-LAN-IP>:5173` on the phone (for example, `http://192.168.0.63:5173`). Do not use `localhost` on the phone; that refers to the phone itself. If it does not connect, turn off VPNs, avoid guest Wi-Fi, and check that the router allows devices on the network to communicate.

## Install as an app

The site is configured as an installable Progressive Web App (PWA), not as a native App Store app or standalone Windows `.exe`. To install it, first deploy the site at a stable HTTPS address. The local development address is temporary, depends on the computer and Wi-Fi, and is not suitable for installation away from that network.

## Public demo deployment

The root `render.yaml` configures one Render Node service to serve the built site and its `/api` routes from the same HTTPS origin.

1. Push this repository to GitHub and create a Render Blueprint from it.
2. Set `ADMIN_CODE` as a private environment variable in Render. Production startup fails if this is missing or left at the local demo default.
3. Deploy and open the `onrender.com` URL Render provides.

The free service can sleep when idle, and its local filesystem is temporary: demo bookings and support requests can be lost when the service restarts or redeploys. Use test data only. Persistent storage requires a paid hosting plan and a persistent disk.

- **Windows:** Open the HTTPS site in Microsoft Edge, select **… > Apps > Install this site as an app**. The app then opens in its own window and can be pinned to Start or the taskbar.
- **iPhone:** Open the HTTPS site in Safari, tap **Share > Add to Home Screen**, then tap **Add**. Launch EmiKettik from the new Home Screen icon.

The PWA caches its app shell for quicker repeat loads and basic offline display. Booking, flight data, and admin features still need the API and an internet connection. Publishing a native iOS App Store app requires a separate iOS project, Apple signing, and an Apple developer account; a signed Windows installer would likewise require separate desktop packaging.

## API routes

- `GET /api/health` — API health check
- `GET /api/flights` — available demo flights and remaining seats
- `POST /api/admin/session` — exchange the demo admin code for an in-memory session token
- `GET /api/admin/flights` — all demo flights with booking counts, schedule status, sales, discounts, airline payout, and estimated profit (80% airline payout)
- `GET /api/admin/bookings` — all saved demo bookings with passenger and flight details
- `GET /api/offers` — available offer codes
- `GET /api/trips?email=...` — bookings associated with an email
- `POST /api/bookings` — create a demo booking; accepts `flightId`, `passengerName`, `email`, `travelers`, and optional `offerCode`
- `POST /api/support` — create a support request; accepts `name`, `email`, `topic`, and `message`

The local demo admin code is `12345`; production requires a different `ADMIN_CODE` environment variable. Admin history requires a server-issued, in-memory session token. This is demo access control only, not production authentication. The app does not process payments or send email. Use only test passenger data; the public deployment is for demos, not real bookings or sensitive personal information.
