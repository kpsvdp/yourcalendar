-- create shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  date      TEXT    NOT NULL,        -- e.g. "2025-04-29"
  type      TEXT    NOT NULL,        -- morning/afternoon/night/extra/leave
  timing    TEXT    NOT NULL,        -- e.g. "8AM–4PM" or leave note
  emoji     TEXT    NOT NULL         -- stored so UI stays in sync
);

-- create birthdays table
CREATE TABLE IF NOT EXISTS birthdays (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  date      TEXT    NOT NULL,        -- e.g. "2025-04-29"
  name      TEXT    NOT NULL         -- person’s name
);
