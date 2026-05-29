console.log("Welcome to the Community Portal");
window.onload = function () {
  alert("Page fully loaded!");
  loadPreference();
  renderEvents(events);
};
const eventName = "Music Fest";
const eventDate = "2025-06-10";
let seats = 5;
console.log(`Event: ${eventName}, Date: ${eventDate}, Seats: ${seats}`);
function Event(name, date, category, seatsAvailable) {
  this.name = name;
  this.date = date;
  this.category = category;
  this.seatsAvailable = seatsAvailable;
}
Event.prototype.checkAvailability = function () {
  return this.seatsAvailable > 0 ? "Available" : "Full";
};
let events = [
  new Event("Music Fest",   "2025-06-10", "music",    5),
  new Event("Tech Expo",    "2025-06-20", "tech",     3),
  new Event("Food Fair",    "2025-06-25", "food",     0),
  new Event("Sports Day",   "2025-06-30", "sports",   8),
  new Event("Art Workshop", "2025-07-05", "workshop", 4),
];
console.log(Object.entries(events[0]));
events.push(new Event("Health Camp", "2025-07-10", "health", 6));
function categoryTracker() {
  let counts = {};
  return function (category) {
    counts[category] = (counts[category] || 0) + 1;
    return counts[category];
  };
}
const trackRegistration = categoryTracker();
function filterEventsByCategory(list, callback) {
  return list.filter(callback);
}
function addEvent(name, date, category, seats) {
  events.push(new Event(name, date, category, seats));
  renderEvents(events);
}
function registerUser(eventIndex) {
  try {
    let ev = events[eventIndex];
    if (!ev) throw new Error("Event not found");
    if (ev.seatsAvailable <= 0) throw new Error("No seats available");
    ev.seatsAvailable--;
    seats--;
    trackRegistration(ev.category);
    alert(`Registered for ${ev.name}. Seats left: ${ev.seatsAvailable}`);
    renderEvents(currentFilter ? filterEventsByCategory(events, e => e.category === currentFilter) : events);
  } catch (err) {
    alert("Error: " + err.message);
  }
}
let currentFilter = "";
function renderEvents(list) {
  const container = document.getElementById("eventContainer");
  container.innerHTML = "";
  list.forEach(function (ev, index) {
    if (ev.seatsAvailable <= 0) return; 
    const card = document.createElement("div");
    card.className = "eventCard";
    card.innerHTML = `
      <h3>${ev.name}</h3>
      <p>Date: ${ev.date}</p>
      <p>Category: ${ev.category}</p>
      <p>Seats: ${ev.seatsAvailable}</p>
      <p>Status: ${ev.checkAvailability()}</p>
      <button onclick="registerUser(${index})">Register</button>
    `;
    container.appendChild(card);
  });
}
function filterByCategory() {
  const val = document.getElementById("categoryFilter").value;
  currentFilter = val;
  if (val === "") {
    renderEvents(events);
  } else {
    const cloned = [...events];
    const filtered = filterEventsByCategory(cloned, e => e.category === val);
    renderEvents(filtered);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchInput").addEventListener("keydown", function () {
    const query = this.value.toLowerCase();
    const result = events.filter(e => e.name.toLowerCase().includes(query));
    renderEvents(result);
  });
});
async function fetchEvents() {
  document.getElementById("spinner").style.display = "block";
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    const data = await res.json();
    console.log("Fetched data:", data);
  } catch (err) {
    console.log("Fetch error:", err);
  } finally {
    document.getElementById("spinner").style.display = "none";
  }
}
function submitRegistration() {
  const form = document.getElementById("regForm");
  const name  = form.elements["name"].value;
  const email = form.elements["email"].value;
  const event = form.elements["event"].value;
  if (!name || !email || !event) {
    document.getElementById("formMsg").innerText = "All fields are required.";
    return;
  }
  document.getElementById("formMsg").innerText = "Submitting...";
  setTimeout(function () {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, event }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Server response:", data);
        document.getElementById("formMsg").innerText = "Registration successful!";
      })
      .catch(() => {
        document.getElementById("formMsg").innerText = "Submission failed.";
      });
  }, 1500);
}
function handleFormSubmit(e) {
  e.preventDefault();
  submitRegistration();
}
function savePref() {
  const val = document.getElementById("prefSelect").value;
  localStorage.setItem("preferredEvent", val);
  sessionStorage.setItem("sessionEvent", val);
  document.getElementById("prefMsg").innerText = "Saved: " + val;
}
function loadPreference() {
  const saved = localStorage.getItem("preferredEvent");
  if (saved) {
    const sel = document.getElementById("prefSelect");
    if (sel) {
      sel.value = saved;
      document.getElementById("prefMsg").innerText = "Loaded: " + saved;
    }
  }
}
function clearPrefs() {
  localStorage.clear();
  sessionStorage.clear();
  document.getElementById("prefSelect").value = "";
  document.getElementById("prefMsg").innerText = "Preferences cleared.";
}
const { name: firstName, date: evDate, category } = events[0];
console.log(`Destructured — Name: ${firstName}, Date: ${evDate}, Category: ${category}`);
function greetUser(username = "Guest") {
  console.log("Hello, " + username);
}
greetUser();
console.log("Events array:", events);
console.log("Use DevTools → Sources to add breakpoints here");
if (typeof $ !== "undefined") {
  $("#registerBtn").click(function () {
    alert("jQuery click works!");
  });
  $(".eventCard").fadeIn(1000);
}