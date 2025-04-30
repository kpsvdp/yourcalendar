// script.js
document.addEventListener('DOMContentLoaded', () => {
  // ——— config & state ———
  const shiftTypes = ['morning','afternoon','night','extra','leave'];
  let currentDate = new Date();
  let shifts     = {};
  let birthdays  = {};

  // ——— localStorage helpers ———
  function storageKey(prefix) {
    // month is 1–12 for human keys
    return `${prefix}-${currentDate.getFullYear()}-${currentDate.getMonth()+1}`;
  }
  function load(prefix) {
    const raw = localStorage.getItem(storageKey(prefix));
    return raw ? JSON.parse(raw) : {};
  }
  function save(prefix, obj) {
    localStorage.setItem(storageKey(prefix), JSON.stringify(obj));
  }

  // ——— update UI bits ———
  function updateHeader() {
    document.getElementById('month-year').textContent =
      currentDate.toLocaleString('en-GB',{ month:'long', year:'numeric' });
  }
  function updateBackground() {
    document.body.className = `bg-${currentDate.getMonth()}`;
  }

  // ——— create one day cell ———
  function createDayCell(y, m, d) {
    const cell = document.createElement('div');
    cell.className = 'day';

    // highlight today
    const today = new Date();
    if (y===today.getFullYear() && m===today.getMonth() && d===today.getDate()) {
      cell.classList.add('today');
    }

    // date number
    const num = document.createElement('div');
    num.className = 'date-number';
    num.textContent = d;
    cell.appendChild(num);

    // key like "2025-4-1"
    const key = `${y}-${m+1}-${d}`;

    // render shift if any
    if (shifts[key]) {
      const s = shifts[key];
      cell.classList.add(s.type);
      const lbl = document.createElement('div');
      lbl.className = 'shift-label';
      lbl.textContent = s.type==='leave'
        ? `🚫 Leave${s.timing?` (${s.timing})`:''}`
        : `${s.emoji} ${s.type} (${s.timing})`;
      cell.appendChild(lbl);
    }

    // render birthday if any
    if (birthdays[key]) {
      const bd = document.createElement('div');
      bd.className = 'birthday-label';
      bd.textContent = `🎂 ${birthdays[key]}`;
      cell.appendChild(bd);
    }

    // click to add/edit/clear
    cell.addEventListener('click', () => {
      const choice = prompt(
        "Enter: morning, afternoon, night, extra, leave, birthday\n(blank to clear)"
      );
      if (choice===null) return;  // cancelled
      const cmd = choice.trim().toLowerCase();

      if (shiftTypes.includes(cmd)) {
        // — add/edit a SHIFT —
        let timing='', emoji='';
        if (cmd==='leave') {
          const note = prompt('Leave note (or blank):');
          if (note===null) return;
          timing = note.trim(); emoji = '🚫';
        } else {
          const t = prompt(`Timing for ${cmd} (e.g. "8AM - 4PM"):`);
          if (t===null) return;
          timing = t.trim();
          emoji = cmd==='morning'   ? '☀️'
                : cmd==='afternoon' ? '🌤️'
                : cmd==='night'     ? '🌙'
                : '⭐';
        }
        shifts[key] = { type:cmd, timing, emoji };
        save('shifts', shifts);

      } else if (cmd==='birthday') {
        // — add/edit a BIRTHDAY —
        const name = prompt('Name for birthday:');
        if (name===null) return;
        if (name.trim()) birthdays[key] = name.trim();
        else delete birthdays[key];
        save('birthdays', birthdays);

      } else if (cmd==='') {
        // — CLEAR both —
        delete shifts[key];
        delete birthdays[key];
        save('shifts', shifts);
        save('birthdays', birthdays);

      } else {
        alert('Invalid entry');
      }

      renderCalendar();
    });

    return cell;
  }

  // ——— build the whole calendar ———
  function renderCalendar() {
    // load for this month
    shifts    = load('shifts');
    birthdays = load('birthdays');

    updateBackground();
    updateHeader();

    const cal = document.getElementById('calendar');
    cal.innerHTML = '';

    // day-of-week headers
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      .forEach(dn => {
        const div = document.createElement('div');
        div.className = 'day-name';
        div.textContent = dn;
        cal.appendChild(div);
      });

    const y = currentDate.getFullYear();
    const mo = currentDate.getMonth();
    const firstDay = new Date(y, mo, 1).getDay();    // 0=Sun ... 6=Sat
    const daysInMonth = new Date(y, mo+1, 0).getDate();

    // blank slots before the 1st
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('div');
      blank.className = 'day';
      cal.appendChild(blank);
    }
    // actual day cells
    for (let d = 1; d <= daysInMonth; d++) {
      cal.appendChild(createDayCell(y, mo, d));
    }
  }

  // ——— wire up prev/next ———
  document.getElementById('prev-month')
    .addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth()-1);
      renderCalendar();
    });
  document.getElementById('next-month')
    .addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth()+1);
      renderCalendar();
    });

  // ——— live clock ———
  setInterval(() => {
    document.getElementById('datetime').textContent =
      new Date().toLocaleString('en-GB', {
        weekday:'long', year:'numeric', month:'long',
        day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'
      });
  }, 1000);

  document.getElementById('view-raw')
    .addEventListener('click', () => {
      window.open('raw.html', '_blank');
    });


  // live time-only clock
  setInterval(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    document.getElementById('clock').textContent = timeStr;
  }, 500);

  // ——— initial draw ———
  renderCalendar();
});
