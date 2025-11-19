// Einfaches Skript, das automatisch Events aus events.json lädt und rendert
async function loadEvents() {
  const res = await fetch('events.json');
  const EVENTS = await res.json();

  const eventContainer = document.getElementById("event-container");
  const lang = (navigator.language || "de").toLowerCase().startsWith("en") ? "en" : "de";
  const isDE = lang === "de";

  eventContainer.innerHTML = "";

  EVENTS.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card";

    const img = document.createElement("img");
    img.className = "event-image";
    img.src = ev.img;
    img.alt = ev.title;
    card.appendChild(img);

    const dateEl = document.createElement("div");
    dateEl.className = "event-date";
    dateEl.textContent = isDE ? ev.date_de : ev.date_en;
    card.appendChild(dateEl);

    const titleEl = document.createElement("div");
    titleEl.className = "event-title";
    titleEl.textContent = ev.title;
    card.appendChild(titleEl);

    if (ev.loc_de || ev.loc_en){
      const descEl = document.createElement("div");
      descEl.className = "event-description";
      descEl.textContent = isDE ? ev.loc_de : ev.loc_en;
      card.appendChild(descEl);
    }

    const linkBtn = document.createElement("a");
    linkBtn.href = ev.link;
    linkBtn.target = "_blank";
    linkBtn.className = "event-button";
    linkBtn.textContent = isDE ? "Mehr Infos" : "More info";
    card.appendChild(linkBtn);

    eventContainer.appendChild(card);
  });
}

// Beim Laden starten
loadEvents();

