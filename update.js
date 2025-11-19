const ARTISTS = [
  "The Lords","The Rattles","The Love Beatles","Eric Clapton","Lynyrd Skynyrd","Joe Bonamassa",
  "Truck Stop","Bob Dylan","Willie Nelson","Kid Rock","Canned Heat","ZZ Top","Johnny Cash Roadshow",
  "The Beach Boys","Alan Jackson","The Who","Tom Astor – Unplugged","The Doobie Brothers",
  "Colosseum","Gregor Meyle"
];

const ACCOUNT_ID = "1690419"; // Dein Bandsintown Account ID
const EVENT_CONTAINER = document.getElementById("event-container");

async function fetchEvents(artist) {
  const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(artist)}/events?app_id=${ACCOUNT_ID}`;
  try {
    const resp = await fetch(url);
    if(!resp.ok) return [];
    const data = await resp.json();
    // Filtert nur zukünftige Termine
    const now = new Date();
    return data.filter(e => new Date(e.datetime) >= now);
  } catch(e) { return []; }
}

async function renderEvents() {
  EVENT_CONTAINER.innerHTML = "";
  let allEvents = [];

  for(const artist of ARTISTS){
    const evs = await fetchEvents(artist);
    allEvents = allEvents.concat(evs.map(e => ({
      artist: artist,
      date: new Date(e.datetime),
      venue: e.venue.name + (e.venue.city ? ", " + e.venue.city : ""),
      url: e.url,
      img: e.artist && e.artist.image_url ? e.artist.image_url : ""
    })));
  }

  allEvents.sort((a,b)=>a.date-b.date);

  if(allEvents.length === 0){
    EVENT_CONTAINER.innerHTML = `<div class="event-card">Derzeit keine Konzerte geplant</div>`;
    return;
  }

  for(const e of allEvents){
    const card = document.createElement("div");
    card.className = "event-card";

    if(e.img){
      const img = document.createElement("img");
      img.src = e.img;
      img.alt = e.artist;
      img.className = "event-image";
      card.appendChild(img);
    }

    const dateEl = document.createElement("div");
    dateEl.className = "event-date";
    dateEl.textContent = e.date.toLocaleDateString("de-DE", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
    card.appendChild(dateEl);

    const titleEl = document.createElement("div");
    titleEl.className = "event-title";
    titleEl.textContent = e.artist;
    card.appendChild(titleEl);

    const venueEl = document.createElement("div");
    venueEl.className = "event-description";
    venueEl.textContent = e.venue;
    card.appendChild(venueEl);

    const linkBtn = document.createElement("a");
    linkBtn.href = e.url;
    linkBtn.target = "_blank";
    linkBtn.className = "event-button";
    linkBtn.textContent = "Mehr Infos";
    card.appendChild(linkBtn);

    EVENT_CONTAINER.appendChild(card);
  }
}

renderEvents();
