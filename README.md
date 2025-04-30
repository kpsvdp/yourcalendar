# My Calendar

A simple, interactive shift and birthday calendar web app. Use it to keep track of daily shifts, birthdays, and notes with a dynamic, month-based background.

## Features

- Responsive month-view calendar with day cells
- Add, edit, and clear shifts (`morning`, `afternoon`, `night`, `extra`, `leave`) with custom timings and emojis
- Track birthdays alongside shifts
- Live clock and dynamic month-based wallpaper background
- View raw data as a sortable table
- Persist data in `localStorage` (client) or SQLite via REST API (server)

## Live Demo

Open `public/index.html` in your browser to try the client-only version. Or start the server for full API-backed persistence:

```bash
# Initialize database
npm run init-db

# Start server
npm start
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Frontend**: HTML5, CSS3 (month-based backgrounds), Vanilla JavaScript
- **Backend**: Node.js, Express.js, SQLite3, CORS, Body-Parser
- **Persistence**: LocalStorage (client) or SQLite database via REST API

## Installation

1. Clone this repository:
   ```bash
   ```

git clone [https://github.com/yourusername/calendar-app.git](https://github.com/yourusername/calendar-app.git)
cd calendar-app

````
2. Install dependencies:
   ```bash
npm install
````

3. Initialize the SQLite database:
   ```bash
   ```

npm run init-db

````
4. Start the server:
   ```bash
npm start
````

5. Open your browser at [http://localhost:3000](http://localhost:3000)

## Configuration

- **Month Wallpapers**:\
  Background images are stored in `public/images/`. Name them `Jan.jpg`, `Feb.jpg`, ..., `Dec.jpg`.
- **Logo**:\
  Place your site logo (e.g. `logo.ico` or `logo.png`) in `public/images/` and reference it in `index.html`:
  ```html
  <img src="images/logo.ico" alt="Logo" id="site-logo">
  ```

## File Structure

```
calendar-app/
├── public/
│   ├── images/          # Add all background wallpapers and logo files here
│   │   ├── Jan.jpg
│   │   ├── Feb.jpg
│   │   └── logo.ico
│   ├── index.html
│   ├── raw.html
│   ├── styles.css
│   └── script.js
├── server/
│   ├── init_db.sql
│   ├── server.js
│   └── package.json
├── data/                # Optional: JSON data for initial import (notes.json, shifts.json, etc.)
└── README.md
```

## Usage

1. **Client-only**: Open `public/index.html`. Data will be saved in browser `localStorage` under keys `shifts-<year>-<month>` and `birthdays-<year>-<month>`.
2. **Server-backed**: Use the REST API endpoints:
   - `GET /api/shifts?year=YYYY&month=M`
   - `POST /api/shifts`
   - `DELETE /api/shifts`
   - `GET /api/birthdays?year=YYYY&month=M`
   - `POST /api/birthdays`
   - `DELETE /api/birthdays`

## Where to Add Images

- Create a folder `public/images/` at the root of the project.
- Place your 12 monthly wallpapers named exactly `Jan.jpg`, `Feb.jpg`, ..., `Dec.jpg` in that folder.
- Place your logo file (`logo.ico` or `logo.png`) in the same `images/` folder.
- References in CSS (`styles.css`) and HTML (`index.html`, `raw.html`) assume this structure.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License
MIT © Pavan Korapati

