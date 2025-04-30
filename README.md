# Mycalendar

A web-based calendar app for tracking work shifts and birthdays—available as a standalone front-end (localStorage) or with a Node.js/Express and SQLite back-end.

## Features
- Interactive monthly calendar with custom backgrounds per month :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}  
- Add, edit, and clear shifts (morning, afternoon, night, extra, leave) and birthdays via in-browser prompts :contentReference[oaicite:2]{index=2}&#8203;:contentReference[oaicite:3]{index=3}  
- Live digital clock display :contentReference[oaicite:4]{index=4}&#8203;:contentReference[oaicite:5]{index=5}  
- Raw data table view of shifts and birthdays :contentReference[oaicite:6]{index=6}&#8203;:contentReference[oaicite:7]{index=7}  
- RESTful API for persisting data to SQLite (optional server mode) :contentReference[oaicite:8]{index=8}&#8203;:contentReference[oaicite:9]{index=9}  

## Demo
Add shifts or birthdays by clicking on calendar cells. Toggle to raw view with the “View raw data” button :contentReference[oaicite:10]{index=10}&#8203;:contentReference[oaicite:11]{index=11}.

## Installation

### Front-End Only (Local Storage)
1. Clone or download the repo.  
2. Open `index.html` in your browser :contentReference[oaicite:12]{index=12}&#8203;:contentReference[oaicite:13]{index=13}.

### Full Stack (Server + Database)
1. Install [Node.js](https://nodejs.org/) v14+.  
2. Clone the repo and navigate to its root.  
3. Install dependencies:
    ```bash
    npm install
    ```
4. Initialize the SQLite database:
    ```bash
    npm run init-db
    ```
5. Start the server:
    ```bash
    npm start
    ```
6. Open `http://localhost:3000` in your browser.

## API Endpoints
The server exposes the following RESTful endpoints (see `server.js` :contentReference[oaicite:14]{index=14}&#8203;:contentReference[oaicite:15]{index=15}):

- **GET** `/api/shifts?year=YYYY&month=M`  
  Returns a JSON object mapping dates to shift entries.
- **POST** `/api/shifts`  
  Body: `{ date, type, timing, emoji }`  
  Creates or updates a shift.
- **DELETE** `/api/shifts`  
  Body: `{ date }`  
  Deletes a shift.

- **GET** `/api/birthdays?year=YYYY&month=M`  
  Returns a JSON object mapping dates to names.
- **POST** `/api/birthdays`  
  Body: `{ date, name }`  
  Creates or updates a birthday.
- **DELETE** `/api/birthdays`  
  Body: `{ date }`  
  Deletes a birthday.

## File Structure

. ├── public/ │ ├── index.html # Main calendar UI ​
 │ ├── raw.html # Raw data table view ​
 │ ├── styles.css # Styling and month backgrounds ​
 │ ├── script.js # Front-end logic ​
 │ └── IMAGES/ # Month wallpapers & logos │ ├── Jan.jpg │ └── … other months ├── server.js # Express server & API ​
 ├── init_db.sql # SQL schema for SQLite tables ├── package.json # Project config & scripts ​
 ├── shifts.json # Sample shift data ​
 └── notes.json # Sample notes data ​

## Database Schema
The SQLite database includes two tables:
- **shifts** (id, date, type, timing, emoji)
- **birthdays** (id, date, name)  
These are defined in `init_db.sql` and in the server initialization logic :contentReference[oaicite:32]{index=32}&#8203;:contentReference[oaicite:33]{index=33}.

## Configuration
- Change port in `server.js` via the `PORT` environment variable (defaults to 3000) :contentReference[oaicite:34]{index=34}&#8203;:contentReference[oaicite:35]{index=35}.

## Contributing
Feel free to open issues or submit pull requests.

## License
pavan


