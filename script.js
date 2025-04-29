const shiftTypes = ['morning','afternoon','night','extra','leave'];
let currentDate = new Date();
let shifts = {}, birthdays = {};

// helper to fetch from our API
async function api(path, method='GET', body) {
  const opts = { method, headers: {'Content-Type':'application/json'} };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`/api/${path}`, opts);
  return res.json();
}

async function loadData() {
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth() + 1;
  shifts = await api(`shifts?year=${y}&month=${m}`);
  birthdays = await api(`birthdays?year=${y}&month=${m}`);
}

async function saveShift(date, obj) {
  if (obj) await api('shifts','POST',{ date, ...obj });
  else        await api('shifts','DELETE',{ date });
}

async function saveBirthday(date,name) {
  if (name)   await api('birthdays','POST',{ date, name });
  else        await api('birthdays','DELETE',{ date });
}

function updateMonthBackground() {
  document.body.className = `bg-${currentDate.getMonth()}`;
}

function createDayCell(y,m,d) {
  const cell = document.createElement('div');
  cell.className = 'day';
  if (y===new Date().getFullYear() && m===new Date().getMonth() && d===new Date().getDate())
    cell.classList.add('today');

  const mm = m+1, key = `${y}-${mm}-${d}`;
  const num = document.createElement('div');
  num.className = 'date-number'; num.textContent = d;
  cell.appendChild(num);

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

  if (birthdays[key]) {
    const bd = document.createElement('div');
    bd.className = 'birthday-label';
    bd.textContent = `🎂 ${birthdays[key]}`;
    cell.appendChild(bd);
  }

  cell.addEventListener('click', async ()=>{
    const raw = prompt("Enter one of: morning, afternoon, night, extra, leave, birthday (or blank to clear)");
    if (raw===null) return;
    const choice = raw.trim().toLowerCase();
    if (shiftTypes.includes(choice)) {
      let timing = '', emoji = '';
      if (choice==='leave') {
        const note = prompt('Enter leave note (or blank):');
        if (note===null) return;
        timing = note.trim(); emoji='🚫';
      } else {
        const custom = prompt(`Enter timing for ${choice} shift (e.g. "8AM - 4PM"):`);
        if (custom===null) return;
        timing = custom.trim();
        emoji = choice==='morning'? '☀️' : choice==='afternoon'? '🌤️'
              : choice==='night'?   '🌙' : '⭐';
      }
      const obj = { type: choice, timing, emoji };
      await saveShift(key, obj);
    }
    else if (choice==='birthday') {
      const name = prompt('Enter name for birthday:');
      if (name===null) return;
      await saveBirthday(key, name.trim()||null);
    }
    else if (choice==='') {
      await saveShift(key,null);
      await saveBirthday(key,null);
    }
    else { alert('Invalid entry'); }
    await renderCalendar();
  });
  return cell;
}

async function renderCalendar() {
  await loadData();
  updateMonthBackground();
  const cal = document.getElementById('calendar');
  cal.innerHTML = '';
  document.getElementById('month-year').textContent =
    currentDate.toLocaleString('en-GB',{ month:'long',year:'numeric' });

  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(day=>{
    const dn = document.createElement('div');
    dn.className='day-name'; dn.textContent=day;
    cal.appendChild(dn);
  });

  const y = currentDate.getFullYear(), mo = currentDate.getMonth();
  const first = new Date(y,mo,1).getDay();
  const days = new Date(y,mo+1,0).getDate();
  for(let i=0;i<first;i++) cal.appendChild(Object.assign(document.createElement('div'),{className:'day'}));
  for(let d=1; d<=days; d++) cal.appendChild(createDayCell(y,mo,d));
}

document.getElementById('prev-month').onclick = ()=>{ currentDate.setMonth(currentDate.getMonth()-1); renderCalendar(); };
document.getElementById('next-month').onclick = ()=>{ currentDate.setMonth(currentDate.getMonth()+1); renderCalendar(); };

document.addEventListener('DOMContentLoaded',()=>{
  setInterval(()=>{
    document.getElementById('datetime').textContent =
      new Date().toLocaleString('en-GB',{
        weekday:'long',year:'numeric',month:'long',day:'numeric',
        hour:'2-digit',minute:'2-digit',second:'2-digit'
      });
  },1000);
  renderCalendar();
});
