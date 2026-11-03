"use strict";

const STORE_KEY = "dhaka-parking-v3";
const BAY_COUNT = 12;
const SIMULATION_MS = 6000;

const AREAS = [
  { id: "gulshan", en: "Gulshan", bn: "গুলশান", roads: [
    { id: "gulshan-ave", en: "Gulshan Avenue", bn: "গুলশান অ্যাভিনিউ", rate: 60, pattern: "TFTTFTTFTTTF", lat: 23.7925, lng: 90.4078 },
    { id: "gulshan-north", en: "Gulshan North Avenue", bn: "গুলশান নর্থ অ্যাভিনিউ", rate: 50, pattern: "TTFTTTFTTFTT", lat: 23.7975, lng: 90.4135 }
  ] },
  { id: "banani", en: "Banani", bn: "বনানী", roads: [
    { id: "kemal", en: "Kemal Ataturk Avenue", bn: "কামাল আতাতুর্ক অ্যাভিনিউ", rate: 60, pattern: "TTTFTTTTFTTT", lat: 23.7915, lng: 90.4045 },
    { id: "chairman", en: "Chairman Bari Road", bn: "চেয়ারম্যান বাড়ি রোড", rate: 40, pattern: "FTFFTTFTFTTF", lat: 23.7985, lng: 90.4 }
  ] },
  { id: "dhanmondi", en: "Dhanmondi", bn: "ধানমন্ডি", roads: [
    { id: "satmasjid", en: "Satmasjid Road", bn: "সাতমসজিদ রোড", rate: 40, pattern: "TTFTFTTTFTTT", lat: 23.747, lng: 90.373 },
    { id: "mirpur", en: "Mirpur Road", bn: "মিরপুর রোড", rate: 50, pattern: "TTTTFTTTTTFT", lat: 23.744, lng: 90.383 }
  ] },
  { id: "uttara", en: "Uttara", bn: "উত্তরা", roads: [
    { id: "sonargaon", en: "Sonargaon Janapath", bn: "সোনারগাঁও জনপথ", rate: 30, pattern: "FFTFTFFTFTFF", lat: 23.869, lng: 90.393 },
    { id: "rabindra", en: "Rabindra Sarani", bn: "রবীন্দ্র সরণি", rate: 30, pattern: "TFFTFTFTTFFT", lat: 23.8745, lng: 90.397 }
  ] }
];

const TEXT = {
  en: {
    brand: "Dhaka Parking", prototype: "Prototype: sample data", sample: "Sample",
    find: "Find", map: "Map", bookings: "Bookings", profile: "Profile",
    heading: "Find parking on your road", search: "Search road or area", useLocation: "Use my location",
    updateLocation: "Update my location", locating: "Finding your location...", all: "All",
    sortMost: "Most free", sortCheapest: "Cheapest", sortNearest: "Nearest", saved: "Saved",
    freeOf: "free of 12", noRoads: "No roads match your search.", savedRoad: "Save road", removeSaved: "Remove saved road",
    outsideDhaka: "You appear to be outside Dhaka, so these roads are far from you.",
    locationDenied: "Location permission was denied. Allow location for this site in Chrome, then try again.",
    locationMissing: "Your location could not be found. Turn on location and try again.",
    locationSlow: "Finding your location took too long. Please try again.",
    locationUnsupported: "This browser cannot share location.",
    perHour: "/hr", free: "free", taken: "Taken", freeBay: "Free", selected: "Selected", backLabel: "Back",
    simOn: "Sensor simulation: On", simOff: "Sensor simulation: Off", chooseBay: "Choose a free bay",
    continueBay: "Continue with bay", checkout: "Review booking", road: "Road", bay: "Bay", rate: "Sample rate",
    duration: "Duration", hour: "hr", vehicle: "Vehicle number", vehiclePlaceholder: "Example: Dhaka Metro Ga 12-3456",
    vehicleRequired: "Enter your vehicle number.", paymentMethod: "Payment method (demo)", methodMobile: "Mobile banking",
    methodCard: "Card", methodBay: "Pay at the bay", demoPayment: "Demo only. No money is charged and no payment details are collected.",
    total: "Total", confirm: "Confirm demo booking", confirmed: "Booking confirmed", code: "Booking code",
    timeLeft: "Time left", ended: "Ended", cancelled: "Cancelled", active: "Active", demoBooking: "This is a demo booking. No real bay has been reserved.",
    directions: "Get directions", extend: "Add 1 hr", cancel: "Cancel", viewBookings: "View my bookings",
    activeBookings: "Active bookings", history: "History", noBookings: "No bookings yet.", findParking: "Find parking",
    yourProfile: "Your profile", name: "Name", language: "Language", switchLanguage: "বাংলা", install: "Install app",
    reset: "Clear demo data", resetConfirm: "Tap again to clear all demo data", about: "About this prototype",
    aboutText: "Your location is real when you allow it. Parking availability, rates and bookings are sample data. A real system would get live bay status from road sensors or cameras.",
    mapTitle: "Parking map", mapOffline: "The map needs an internet connection. You can still use the Find tab.",
    keyHigh: "4 or more free", keyLow: "1 to 3 free", keyNone: "Full", approx: "Road positions are approximate."
  },
  bn: {
    brand: "ঢাকা পার্কিং", prototype: "প্রোটোটাইপ: নমুনা ডেটা", sample: "নমুনা",
    find: "খুঁজুন", map: "ম্যাপ", bookings: "বুকিং", profile: "প্রোফাইল",
    heading: "আপনার রাস্তায় পার্কিং খুঁজুন", search: "রাস্তা বা এলাকা খুঁজুন", useLocation: "আমার লোকেশন ব্যবহার করুন",
    updateLocation: "লোকেশন আপডেট করুন", locating: "লোকেশন খোঁজা হচ্ছে...", all: "সব",
    sortMost: "বেশি ফাঁকা", sortCheapest: "কম ভাড়া", sortNearest: "সবচেয়ে কাছে", saved: "সেভ করা",
    freeOf: "১২টির মধ্যে ফাঁকা", noRoads: "এই নামে কোনো রাস্তা পাওয়া যায়নি।", savedRoad: "রাস্তা সেভ করুন", removeSaved: "সেভ থেকে সরান",
    outsideDhaka: "আপনি সম্ভবত ঢাকার বাইরে আছেন, তাই এই রাস্তাগুলো আপনার থেকে দূরে।",
    locationDenied: "লোকেশনের অনুমতি দেওয়া হয়নি। Chrome-এ এই সাইটের জন্য অনুমতি দিয়ে আবার চেষ্টা করুন।",
    locationMissing: "লোকেশন পাওয়া যায়নি। লোকেশন চালু করে আবার চেষ্টা করুন।",
    locationSlow: "লোকেশন পেতে বেশি সময় লাগছে। আবার চেষ্টা করুন।",
    locationUnsupported: "এই ব্রাউজারে লোকেশন সুবিধা নেই।",
    perHour: "/ঘণ্টা", free: "ফাঁকা", taken: "ভরা", freeBay: "ফাঁকা", selected: "বাছাই করা", backLabel: "ফিরে যান",
    simOn: "সেন্সর সিমুলেশন: চালু", simOff: "সেন্সর সিমুলেশন: বন্ধ", chooseBay: "একটি ফাঁকা বে বাছুন",
    continueBay: "এগিয়ে যান: বে", checkout: "বুকিং যাচাই করুন", road: "রাস্তা", bay: "বে", rate: "নমুনা ভাড়া",
    duration: "সময়", hour: "ঘণ্টা", vehicle: "গাড়ির নম্বর", vehiclePlaceholder: "উদাহরণ: ঢাকা মেট্রো গ ১২-৩৪৫৬",
    vehicleRequired: "গাড়ির নম্বর লিখুন।", paymentMethod: "পেমেন্টের ধরন (ডেমো)", methodMobile: "মোবাইল ব্যাংকিং",
    methodCard: "কার্ড", methodBay: "বে-তে পরিশোধ", demoPayment: "এটি শুধু ডেমো। কোনো টাকা কাটা হবে না এবং কোনো পেমেন্ট তথ্য নেওয়া হবে না।",
    total: "মোট", confirm: "ডেমো বুকিং নিশ্চিত করুন", confirmed: "বুকিং নিশ্চিত হয়েছে", code: "বুকিং কোড",
    timeLeft: "বাকি সময়", ended: "শেষ", cancelled: "বাতিল", active: "চলমান", demoBooking: "এটি ডেমো বুকিং। আসলে কোনো বে সংরক্ষণ করা হয়নি।",
    directions: "রুট দেখুন", extend: "১ ঘণ্টা বাড়ান", cancel: "বাতিল করুন", viewBookings: "আমার বুকিং দেখুন",
    activeBookings: "চলমান বুকিং", history: "পুরোনো বুকিং", noBookings: "এখনো কোনো বুকিং নেই।", findParking: "পার্কিং খুঁজুন",
    yourProfile: "আপনার প্রোফাইল", name: "নাম", language: "ভাষা", switchLanguage: "English", install: "অ্যাপ ইনস্টল করুন",
    reset: "ডেমো ডেটা মুছুন", resetConfirm: "সব ডেমো ডেটা মুছতে আবার চাপুন", about: "এই প্রোটোটাইপ সম্পর্কে",
    aboutText: "আপনি অনুমতি দিলে লোকেশন আসল হয়। পার্কিংয়ের তথ্য, ভাড়া ও বুকিং নমুনা ডেটা। আসল সিস্টেমে রাস্তার সেন্সর বা ক্যামেরা থেকে বে-র লাইভ তথ্য আসবে।",
    mapTitle: "পার্কিং ম্যাপ", mapOffline: "ম্যাপের জন্য ইন্টারনেট লাগবে। তবে খুঁজুন ট্যাব ব্যবহার করতে পারবেন।",
    keyHigh: "৪টি বা বেশি ফাঁকা", keyLow: "১ থেকে ৩টি ফাঁকা", keyNone: "ভরা", approx: "রাস্তার অবস্থান আনুমানিক।"
  }
};

const ICONS = {
  find: '<path d="M21 21l-4.3-4.3"></path><circle cx="11" cy="11" r="7"></circle>',
  map: '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle>',
  bookings: '<rect x="4" y="5" width="16" height="16" rx="2"></rect><path d="M4 10h16M8 3v4M16 3v4"></path>',
  profile: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.5-4 4.5-6 8-6s6.500 2 8 6"></path>'
};

const defaultStore = () => ({
  lang: "en",
  profile: { name: "", vehicle: "" },
  bookings: [],
  saved: []
});

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? { ...defaultStore(), ...JSON.parse(raw) } : defaultStore();
  } catch {
    return defaultStore();
  }
}

const store = loadStore();

function saveStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    // The app still works for this visit if the browser blocks storage.
  }
}

const state = {
  tab: "find",
  view: "tab",
  query: "",
  areaFilter: "all",
  mapArea: "gulshan",
  sort: "most",
  savedOnly: false,
  roadId: null,
  selected: null,
  overrides: {},
  simulation: true,
  simulationStep: 0,
  location: null,
  locationStatus: "idle",
  locationError: "",
  checkout: null,
  ticketId: null,
  resetArmed: false
};

const app = document.getElementById("app");
const tabs = document.getElementById("tabs");
let installPrompt = null;
let leafletMap = null;

const t = (key) => TEXT[store.lang][key];
const named = (item) => item[store.lang];

function number(value) {
  const text = String(value);
  if (store.lang !== "bn") return text;
  return text.replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

const allRoads = () => AREAS.flatMap((area) => area.roads.map((road) => ({ road, area })));
const findRoad = (id) => allRoads().find((entry) => entry.road.id === id);
const bayName = (index) => `${index % 2 === 0 ? "A" : "B"}${Math.floor(index / 2) + 1}`;
const money = (value) => `${store.lang === "bn" ? "৳" : "Tk"} ${number(value)}`;

function refreshBookings() {
  const now = Date.now();
  let changed = false;
  store.bookings.forEach((booking) => {
    if (booking.status === "active" && booking.endsAt <= now) {
      booking.status = "ended";
      changed = true;
    }
  });
  if (changed) saveStore();
}

function bookingFor(roadId, index) {
  return store.bookings.find(
    (booking) => booking.status === "active" && booking.roadId === roadId && booking.bayIndex === index
  );
}

function isTaken(road, index) {
  if (bookingFor(road.id, index)) return true;
  const key = `${road.id}:${index}`;
  return key in state.overrides ? state.overrides[key] : road.pattern[index] === "T";
}

function freeCount(road) {
  let free = 0;
  for (let index = 0; index < BAY_COUNT; index += 1) {
    if (!isTaken(road, index)) free += 1;
  }
  return free;
}

function distanceKm(from, to) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const latDelta = radians(to.lat - from.lat);
  const lngDelta = radians(to.lng - from.lng);
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(lngDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km) {
  if (km < 1) return `${number(Math.round(km * 1000))} ${store.lang === "bn" ? "মিটার" : "m"}`;
  if (km < 100) return `${number(km.toFixed(1))} ${store.lang === "bn" ? "কিমি" : "km"}`;
  return `${number(Math.round(km).toLocaleString("en"))} ${store.lang === "bn" ? "কিমি" : "km"}`;
}

function visibleRoads() {
  const query = state.query.trim().toLowerCase();
  const entries = allRoads()
    .filter(({ area }) => state.areaFilter === "all" || area.id === state.areaFilter)
    .filter(({ road }) => !state.savedOnly || store.saved.includes(road.id))
    .filter(({ road, area }) => {
      if (!query) return true;
      return [road.en, road.bn, area.en, area.bn].some((value) => value.toLowerCase().includes(query));
    });
  const sorters = {
    most: (a, b) => freeCount(b.road) - freeCount(a.road),
    cheapest: (a, b) => a.road.rate - b.road.rate,
    nearest: (a, b) => distanceKm(state.location, a.road) - distanceKm(state.location, b.road)
  };
  const sorter = sorters[state.sort === "nearest" && !state.location ? "most" : state.sort];
  return entries.sort(sorter);
}

function renderRoadCards() {
  const entries = visibleRoads();
  if (!entries.length) return `<p class="note">${t("noRoads")}</p>`;
  return entries.map(({ road, area }) => {
    const saved = store.saved.includes(road.id);
    const distance = state.location ? ` · ${formatDistance(distanceKm(state.location, road))}` : "";
    return `
      <div class="road-card">
        <button class="road-main" data-action="openRoad" data-id="${road.id}">
          <span class="road-text">
            <span class="road-name">${named(road)}</span>
            <span class="road-meta">${named(area)}${distance}</span>
            <span class="road-meta">${money(road.rate)}${t("perHour")} (${t("sample")})</span>
          </span>
          <span class="road-free"><b>${number(freeCount(road))}</b><span>${t("freeOf")}</span></span>
        </button>
        <button class="star" data-action="toggleSaved" data-id="${road.id}" aria-pressed="${saved}"
          aria-label="${saved ? t("removeSaved") : t("savedRoad")}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6-4.3-4.2 6-.9z"></path></svg>
        </button>
      </div>
    `;
  }).join("");
}

function renderFind() {
  const loading = state.locationStatus === "loading";
  const locationLabel = loading ? t("locating") : state.location ? t("updateLocation") : t("useLocation");
  const nearestRoad = state.location
    ? Math.min(...allRoads().map(({ road }) => distanceKm(state.location, road)))
    : 0;
  const areaChips = [{ id: "all", label: t("all") }]
    .concat(AREAS.map((area) => ({ id: area.id, label: named(area) })))
    .map((item) => `
      <button class="chip" data-action="areaFilter" data-id="${item.id}" aria-pressed="${state.areaFilter === item.id}">${item.label}</button>
    `).join("");
  const sortChips = [["most", "sortMost"], ["cheapest", "sortCheapest"], ["nearest", "sortNearest"]]
    .map(([id, label]) => `
      <button class="chip" data-action="sort" data-id="${id}" aria-pressed="${state.sort === id}">${t(label)}</button>
    `).join("");
  return `
    <div class="topbar">
      <span class="brand">${t("brand")}</span>
      <span class="badge">${t("prototype")}</span>
    </div>
    <h1>${t("heading")}</h1>
    <input class="search" id="search" type="search" value="${esc(state.query)}"
      placeholder="${t("search")}" aria-label="${t("search")}">
    <section class="section">
      <button class="secondary" data-action="locate" ${loading ? "disabled" : ""}>${locationLabel}</button>
      ${state.locationError ? `<p class="error" role="alert">${state.locationError}</p>` : ""}
      ${state.location && nearestRoad > 50 ? `<p class="note">${t("outsideDhaka")}</p>` : ""}
    </section>
    <div class="chips" role="group" aria-label="${t("all")}">${areaChips}</div>
    <div class="chips" role="group" aria-label="${t("sortMost")}">
      ${sortChips}
      <button class="chip" data-action="savedOnly" aria-pressed="${state.savedOnly}">${t("saved")}</button>
    </div>
    <section class="section" id="road-list">${renderRoadCards()}</section>
    ${installPrompt ? `<button class="secondary" data-action="install">${t("install")}</button>` : ""}
    <p class="credit">Made by Afrin Sultana</p>
  `;
}

function renderMapTab() {
  return `
    <div class="topbar">
      <h1>${t("mapTitle")}</h1>
      <span class="badge">${t("sample")}</span>
    </div>
    <div class="chips" role="group" aria-label="${t("mapTitle")}">
      ${AREAS.map((area) => `
        <button class="chip" data-action="mapArea" data-id="${area.id}" aria-pressed="${state.mapArea === area.id}">${named(area)}</button>
      `).join("")}
    </div>
    <div id="map" role="region" aria-label="${t("mapTitle")}"></div>
    <p class="error" id="map-offline" role="status" hidden>${t("mapOffline")}</p>
    <div class="key">
      <span><i style="background:#F5B301"></i>${t("keyHigh")}</span>
      <span><i style="background:#FF8A3D"></i>${t("keyLow")}</span>
      <span><i style="background:#F7F4EC"></i>${t("keyNone")}</span>
    </div>
    <p class="note">${t("approx")}</p>
    <button class="secondary" data-action="locate">${state.location ? t("updateLocation") : t("useLocation")}</button>
    ${state.locationError ? `<p class="error" role="alert">${state.locationError}</p>` : ""}
  `;
}

function mountMap() {
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
  const element = document.getElementById("map");
  if (!element || !window.L) return;
  leafletMap = L.map(element, {
    zoomControl: true,
    zoomAnimation: false,
    fadeAnimation: false,
    markerZoomAnimation: false
  }).setView([23.81, 90.395], 12);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(leafletMap);
  tiles.on("tileerror", () => {
    const notice = document.getElementById("map-offline");
    if (notice) notice.hidden = false;
  });
  allRoads().forEach(({ road }) => {
    const free = freeCount(road);
    const level = free === 0 ? "none" : free < 4 ? "low" : "";
    const icon = L.divIcon({
      className: `pin ${level}`,
      html: number(free),
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });
    L.marker([road.lat, road.lng], { icon, title: named(road), alt: named(road) })
      .addTo(leafletMap)
      .on("click", () => openRoad(road.id));
  });
  const points = AREAS.find((area) => area.id === state.mapArea).roads.map((road) => [road.lat, road.lng]);
  if (state.location) {
    const icon = L.divIcon({ className: "me-pin", iconSize: [18, 18], iconAnchor: [9, 9] });
    L.marker([state.location.lat, state.location.lng], { icon, keyboard: false, interactive: false }).addTo(leafletMap);
  }
  leafletMap.fitBounds(points, { padding: [50, 50], maxZoom: 15, animate: false });
}

function backButton(action) {
  return `
    <button class="back" data-action="${action}" aria-label="${t("backLabel")}">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>
    </button>
  `;
}

function renderBay(road, index) {
  const taken = isTaken(road, index);
  const selected = state.selected === index;
  const status = taken ? t("taken") : selected ? t("selected") : t("freeBay");
  return `
    <button class="bay ${selected ? "selected" : ""}" data-action="pickBay" data-index="${index}"
      aria-label="${t("bay")} ${bayName(index)}, ${status}" ${taken ? "disabled" : ""}>
      <b>${bayName(index)}</b><span>${status}</span>
    </button>
  `;
}

function renderRoad() {
  const { road, area } = findRoad(state.roadId);
  const rows = Array.from({ length: BAY_COUNT / 2 }, (_, row) => `
    <div class="bay-row">
      ${renderBay(road, row * 2)}
      <div class="lane" aria-hidden="true"></div>
      ${renderBay(road, row * 2 + 1)}
    </div>
  `).join("");
  const nextLabel = state.selected === null ? t("chooseBay") : `${t("continueBay")} ${bayName(state.selected)}`;
  return `
    <div class="subheader">
      ${backButton("backToTab")}
      <div class="subheader-title">
        <h2>${named(road)}</h2>
        <div class="label" role="status">${named(area)}, ${number(freeCount(road))} ${t("free")} · ${money(road.rate)}${t("perHour")}</div>
      </div>
      <span class="badge">${t("sample")}</span>
    </div>
    <div class="bays">${rows}</div>
    <div class="actions">
      <button class="secondary" data-action="toggleSimulation" aria-pressed="${state.simulation}">${state.simulation ? t("simOn") : t("simOff")}</button>
      <button class="primary" data-action="startCheckout" ${state.selected === null ? "disabled" : ""}>${nextLabel}</button>
    </div>
  `;
}

function renderCheckout() {
  const checkout = state.checkout;
  const { road, area } = findRoad(checkout.roadId);
  const hours = [1, 2, 3, 4].map((value) => `
    <button class="chip" data-action="setHours" data-value="${value}" aria-pressed="${checkout.hours === value}">${number(value)} ${t("hour")}</button>
  `).join("");
  const methods = [["mobile", "methodMobile"], ["card", "methodCard"], ["bay", "methodBay"]].map(([id, label]) => `
    <button class="chip" data-action="setMethod" data-value="${id}" aria-pressed="${checkout.method === id}">${t(label)}</button>
  `).join("");
  return `
    <div class="subheader">
      ${backButton("backToRoad")}
      <div class="subheader-title"><h2>${t("checkout")}</h2></div>
      <span class="badge">${t("sample")}</span>
    </div>
    <section class="summary">
      <div class="summary-row"><span>${t("road")}</span><span>${named(road)}, ${named(area)}</span></div>
      <div class="summary-row"><span>${t("bay")}</span><span>${bayName(checkout.bayIndex)}</span></div>
      <div class="summary-row"><span>${t("rate")}</span><span>${money(road.rate)}${t("perHour")}</span></div>
      <div class="summary-row total"><span>${t("total")}</span><span id="total">${money(road.rate * checkout.hours)}</span></div>
    </section>
    <section class="section">
      <div class="label">${t("duration")}</div>
      <div class="options">${hours}</div>
    </section>
    <div class="field-group">
      <label for="vehicle">${t("vehicle")}</label>
      <input class="field" id="vehicle" autocomplete="off" value="${esc(checkout.vehicle)}" placeholder="${t("vehiclePlaceholder")}">
      ${checkout.error ? `<p class="error" role="alert">${checkout.error}</p>` : ""}
    </div>
    <section class="section">
      <div class="label">${t("paymentMethod")}</div>
      <div class="methods">${methods}</div>
      <p class="note">${t("demoPayment")}</p>
    </section>
    <button class="primary" data-action="confirmBooking">${t("confirm")}</button>
  `;
}

function countdownText(booking) {
  const seconds = Math.max(0, Math.floor((booking.endsAt - Date.now()) / 1000));
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const rest = String(seconds % 60).padStart(2, "0");
  return number(`${hours}:${minutes}:${rest}`);
}

function directionsUrl(booking) {
  const { road, area } = findRoad(booking.roadId);
  const query = encodeURIComponent(`${road.en}, ${area.en}, Dhaka`);
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
}

function renderTicket() {
  const booking = store.bookings.find((item) => item.id === state.ticketId);
  const { road, area } = findRoad(booking.roadId);
  return `
    <div class="ticket-check">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.500"></path></svg>
    </div>
    <h1>${t("confirmed")}</h1>
    <section class="summary">
      <div class="summary-row"><span>${t("code")}</span><span>${booking.code}</span></div>
      <div class="summary-row"><span>${t("road")}</span><span>${named(road)}, ${named(area)}</span></div>
      <div class="summary-row"><span>${t("bay")}</span><span>${bayName(booking.bayIndex)}</span></div>
      <div class="summary-row"><span>${t("vehicle")}</span><span>${esc(booking.vehicle)}</span></div>
      <div class="summary-row total"><span>${t("total")}</span><span>${money(booking.cost)}</span></div>
    </section>
    <div class="section">
      <div class="label">${t("timeLeft")}</div>
      <div class="countdown" data-countdown="${booking.id}">${countdownText(booking)}</div>
    </div>
    <p class="note">${t("demoBooking")}</p>
    <div class="actions">
      <a class="primary" href="${directionsUrl(booking)}" target="_blank" rel="noopener">${t("directions")}</a>
      <button class="secondary" data-action="viewBookings">${t("viewBookings")}</button>
    </div>
  `;
}

function renderBookingCard(booking) {
  const { road, area } = findRoad(booking.roadId);
  const active = booking.status === "active";
  const statusLabel = { active: t("active"), ended: t("ended"), cancelled: t("cancelled") }[booking.status];
  return `
    <article class="booking-card">
      <div class="row">
        <h3>${named(road)}</h3>
        <span class="status ${active ? "active" : ""}">${statusLabel}</span>
      </div>
      <div class="road-meta">${named(area)} · ${t("bay")} ${bayName(booking.bayIndex)} · ${booking.code}</div>
      <div class="road-meta">${esc(booking.vehicle)} · ${money(booking.cost)}</div>
      ${active ? `
        <div class="countdown" data-countdown="${booking.id}">${countdownText(booking)}</div>
        <a class="primary" href="${directionsUrl(booking)}" target="_blank" rel="noopener">${t("directions")}</a>
        <div class="buttons">
          <button class="secondary" data-action="extendBooking" data-id="${booking.id}">${t("extend")}</button>
          <button class="secondary danger" data-action="cancelBooking" data-id="${booking.id}">${t("cancel")}</button>
        </div>
      ` : ""}
    </article>
  `;
}

function renderBookings() {
  const active = store.bookings.filter((booking) => booking.status === "active");
  const past = store.bookings.filter((booking) => booking.status !== "active");
  return `
    <div class="topbar">
      <h1>${t("bookings")}</h1>
      <span class="badge">${t("sample")}</span>
    </div>
    ${store.bookings.length ? "" : `
      <p class="note">${t("noBookings")}</p>
      <button class="primary" data-action="goFind">${t("findParking")}</button>
    `}
    ${active.length ? `<section class="section"><div class="label">${t("activeBookings")}</div>${active.map(renderBookingCard).join("")}</section>` : ""}
    ${past.length ? `<section class="section"><div class="label">${t("history")}</div>${past.map(renderBookingCard).join("")}</section>` : ""}
  `;
}

function renderProfile() {
  return `
    <h1>${t("yourProfile")}</h1>
    <div class="field-group">
      <label for="profile-name">${t("name")}</label>
      <input class="field" id="profile-name" data-profile="name" autocomplete="name" value="${esc(store.profile.name)}">
    </div>
    <div class="field-group">
      <label for="profile-vehicle">${t("vehicle")}</label>
      <input class="field" id="profile-vehicle" data-profile="vehicle" autocomplete="off"
        value="${esc(store.profile.vehicle)}" placeholder="${t("vehiclePlaceholder")}">
    </div>
    <section class="section">
      <div class="label">${t("language")}</div>
      <button class="secondary" data-action="toggleLanguage">${t("switchLanguage")}</button>
    </section>
    ${installPrompt ? `<button class="secondary" data-action="install">${t("install")}</button>` : ""}
    <section class="summary">
      <h3>${t("about")}</h3>
      <p class="note">${t("aboutText")}</p>
    </section>
    <button class="secondary danger" data-action="resetData">${state.resetArmed ? t("resetConfirm") : t("reset")}</button>
    <p class="credit">Made by Afrin Sultana</p>
  `;
}

function renderTabs() {
  tabs.hidden = state.view !== "tab";
  tabs.setAttribute("aria-label", t("find"));
  tabs.innerHTML = ["find", "map", "bookings", "profile"].map((tab) => `
    <button class="tab" data-action="setTab" data-id="${tab}" ${state.tab === tab ? 'aria-current="page"' : ""}>
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[tab]}</svg>
      <span>${t(tab)}</span>
    </button>
  `).join("");
}

function render() {
  refreshBookings();
  document.documentElement.lang = store.lang;
  document.title = t("brand");
  const tabViews = { find: renderFind, map: renderMapTab, bookings: renderBookings, profile: renderProfile };
  const views = { road: renderRoad, checkout: renderCheckout, ticket: renderTicket };
  const showMap = state.view === "tab" && state.tab === "map";
  if (leafletMap && !showMap) {
    leafletMap.remove();
    leafletMap = null;
  }
  app.classList.toggle("no-tabs", state.view !== "tab");
  app.innerHTML = state.view === "tab" ? tabViews[state.tab]() : views[state.view]();
  renderTabs();
  if (showMap) mountMap();
}

function openRoad(id) {
  state.roadId = id;
  state.selected = null;
  state.view = "road";
  render();
  window.scrollTo(0, 0);
}

function locate() {
  if (!("geolocation" in navigator)) {
    state.locationError = t("locationUnsupported");
    return;
  }
  state.locationStatus = "loading";
  state.locationError = "";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      state.location = { lat: position.coords.latitude, lng: position.coords.longitude };
      state.locationStatus = "ready";
      state.sort = "nearest";
      state.mapArea = allRoads().sort(
        (a, b) => distanceKm(state.location, a.road) - distanceKm(state.location, b.road)
      )[0].area.id;
      render();
    },
    (error) => {
      const messages = { 1: "locationDenied", 2: "locationMissing", 3: "locationSlow" };
      state.locationStatus = "idle";
      state.locationError = t(messages[error.code] || "locationMissing");
      render();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

const actions = {
  setTab(button) {
    state.tab = button.dataset.id;
    state.view = "tab";
    state.resetArmed = false;
  },
  goFind() {
    state.tab = "find";
    state.view = "tab";
  },
  locate,
  areaFilter(button) {
    state.areaFilter = button.dataset.id;
  },
  mapArea(button) {
    state.mapArea = button.dataset.id;
  },
  sort(button) {
    state.sort = button.dataset.id;
    if (button.dataset.id === "nearest" && !state.location) locate();
  },
  savedOnly() {
    state.savedOnly = !state.savedOnly;
  },
  toggleSaved(button) {
    const id = button.dataset.id;
    store.saved = store.saved.includes(id)
      ? store.saved.filter((item) => item !== id)
      : [...store.saved, id];
    saveStore();
  },
  openRoad(button) {
    openRoad(button.dataset.id);
  },
  backToTab() {
    state.view = "tab";
    state.roadId = null;
    state.selected = null;
  },
  backToRoad() {
    state.view = "road";
  },
  pickBay(button) {
    const index = Number(button.dataset.index);
    state.selected = state.selected === index ? null : index;
  },
  toggleSimulation() {
    state.simulation = !state.simulation;
  },
  startCheckout() {
    state.checkout = {
      roadId: state.roadId,
      bayIndex: state.selected,
      hours: 1,
      method: "mobile",
      vehicle: store.profile.vehicle,
      error: ""
    };
    state.view = "checkout";
    window.scrollTo(0, 0);
  },
  setHours(button) {
    state.checkout.hours = Number(button.dataset.value);
  },
  setMethod(button) {
    state.checkout.method = button.dataset.value;
  },
  confirmBooking() {
    const checkout = state.checkout;
    const vehicle = checkout.vehicle.trim();
    if (!vehicle) {
      checkout.error = t("vehicleRequired");
      return;
    }
    const { road } = findRoad(checkout.roadId);
    const now = Date.now();
    const booking = {
      id: String(now),
      code: `DP-${now.toString(36).slice(-6).toUpperCase()}`,
      roadId: road.id,
      bayIndex: checkout.bayIndex,
      hours: checkout.hours,
      rate: road.rate,
      cost: road.rate * checkout.hours,
      method: checkout.method,
      vehicle,
      startedAt: now,
      endsAt: now + checkout.hours * 3600000,
      status: "active"
    };
    store.bookings.unshift(booking);
    store.profile.vehicle = vehicle;
    saveStore();
    state.ticketId = booking.id;
    state.checkout = null;
    state.selected = null;
    state.view = "ticket";
    window.scrollTo(0, 0);
  },
  viewBookings() {
    state.tab = "bookings";
    state.view = "tab";
    state.roadId = null;
  },
  extendBooking(button) {
    const booking = store.bookings.find((item) => item.id === button.dataset.id);
    booking.hours += 1;
    booking.cost += booking.rate;
    booking.endsAt += 3600000;
    saveStore();
  },
  cancelBooking(button) {
    const booking = store.bookings.find((item) => item.id === button.dataset.id);
    booking.status = "cancelled";
    state.overrides[`${booking.roadId}:${booking.bayIndex}`] = false;
    saveStore();
  },
  toggleLanguage() {
    store.lang = store.lang === "en" ? "bn" : "en";
    saveStore();
  },
  resetData() {
    if (!state.resetArmed) {
      state.resetArmed = true;
      return;
    }
    const lang = store.lang;
    Object.assign(store, defaultStore(), { lang });
    state.overrides = {};
    state.resetArmed = false;
    saveStore();
  },
  async install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    installPrompt = null;
  }
};

document.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  await actions[button.dataset.action](button);
  if (button.dataset.action !== "openRoad") render();
});

app.addEventListener("input", (event) => {
  const target = event.target;
  if (target.id === "search") {
    state.query = target.value;
    document.getElementById("road-list").innerHTML = renderRoadCards();
  } else if (target.id === "vehicle") {
    state.checkout.vehicle = target.value;
  } else if (target.dataset.profile) {
    store.profile[target.dataset.profile] = target.value;
    saveStore();
  }
});

function simulateSensor() {
  if (state.view !== "road" || !state.simulation) return;
  const { road } = findRoad(state.roadId);
  const index = (state.simulationStep * 5 + 2) % BAY_COUNT;
  state.simulationStep += 1;
  if (bookingFor(road.id, index)) return;
  state.overrides[`${road.id}:${index}`] = !isTaken(road, index);
  if (state.selected === index) state.selected = null;
  render();
}

function tickCountdowns() {
  document.querySelectorAll("[data-countdown]").forEach((element) => {
    const booking = store.bookings.find((item) => item.id === element.dataset.countdown);
    if (booking) element.textContent = countdownText(booking);
  });
  const finished = store.bookings.some((item) => item.status === "active" && item.endsAt <= Date.now());
  if (finished && state.view === "tab" && state.tab === "bookings") render();
}

setInterval(simulateSensor, SIMULATION_MS);
setInterval(tickCountdowns, 1000);

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  if (state.view === "tab" && (state.tab === "find" || state.tab === "profile")) render();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((error) => console.error(error));
  });
}

render();
