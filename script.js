const API_KEY = "pEvhlVJYuZtXYKSst1uIthDDF0NC5Ts9";
const ARTISTS = ["The Lords","The Rattles","The Love Beatles","Eric Clapton","Lynyrd Skynyrd","Joe Bonamassa","Truck Stop","Bob Dylan"];
const container = document.getElementById("event-container");

async function fetchEvents(artist) {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(artist)}&sort=date,asc&apikey=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data._embedded || !data._embedded.events) return [];
  return data._embedded.events.map(ev => ({
    title: ev.name,
    date: ev.dates.start.localDate,
    time: ev.dates.start.localTime || "",
    location: ev._embedded.venues[0].city.name + ", " + ev._embedded.venues[0].country.name,
    img: ev.images[0].url,
    link: ev.url
  }));
}

async function loadEvents() {
  container.innerHTML = "";
  let allEvents = [];
  for (const artist of ARTISTS) {
    const events = await fetchEvents(artist);
    allEvents.push(...events);
  }

  // Filter vergangene Termine
  const now = new Date();
  allEvents = allEvents.filter(ev => new Date(ev.date) >= now);

  if (allEvents.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center;">Derzeit keine Konzerte geplant</p>`;
    return;
  }

  allEvents.sort((a,b)=> new Date(a.date) - new Date(b.date));

  allEvents.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
      <img class="event-image" src="${ev.img}" alt="${ev.title}">
      <div class="event-date">${ev.date} ${ev.time}</div>
      <div class="event-title">${ev.title}</div>
      <div class="event-description">${ev.location}</div>
      <a class="event-button" href="${ev.link}" target="_blank">Mehr Infos</a>
    `;
    container.appendChild(card);
  });
}

// Initial laden
loadEvents();
