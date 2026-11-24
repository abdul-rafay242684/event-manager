const API = '/attendees';
let attendees = [];

const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const eventInput = document.getElementById('event');
const typeInput = document.getElementById('ticketType');
const priceInput = document.getElementById('price');
const list = document.getElementById('list');
const total = document.getElementById('total');
const error = document.getElementById('error');

async function load() {
  const res = await fetch(API);
  attendees = await res.json();
  render();
}

function render() {
  list.innerHTML = '';
  // destructuring
  attendees.forEach(({ id, name, event, ticketType, price }) => {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = `
      <div class="card"><div class="card-body">
        <h6>${name}</h6>
        <p class="mb-1">${event} • ${ticketType}</p>
        <p class="mb-2">$${price}</p>
        <button class="btn btn-sm btn-danger" data-id="${id}">Remove</button>
      </div></div>`;
    list.appendChild(col);
  });
  // reduce() for live total
  total.textContent = attendees.reduce((sum, a) => sum + a.price, 0);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: nameInput.value.trim(),
    event: eventInput.value.trim(),
    ticketType: typeInput.value,
    price: priceInput.value
  };
  // validation: no empty fields
  if (Object.values(data).some(v => v === '')) {
    error.textContent = 'All fields are required';
    return;
  }
  error.textContent = '';
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const created = await res.json();
  attendees = [...attendees, created]; // spread operator
  render();
  form.reset();
});

list.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  attendees = attendees.filter(a => a.id !== Number(id));
  render();
});

load();
