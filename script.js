// Function to update the time
function updateTime() {
  const timeElement = document.getElementById("time");
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12;
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = hours.toString().padStart(2, "0");
  timeElement.textContent = `${hoursStr}:${minutes}`;
}

// Function to set greeting message based on the time
function setGreeting() {
  const greetingElement = document.getElementById("greeting");
  const hours = new Date().getHours();
  let greeting = "Good evening";
  if (hours >= 5 && hours < 12) greeting = "Good morning";
  else if (hours >= 12 && hours < 17) greeting = "Good afternoon";
  greetingElement.textContent = greeting + ", Pranav.";
}

// Function to fetch weather data
async function fetchWeather(lat = null, lon = null) {
  const url =
    lat && lon
      ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${CONFIG.WEATHER_API_KEY}`
      : `https://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=${CONFIG.WEATHER_API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    document.querySelector(
      ".weather-title"
    ).textContent = `${data.main.temp}°C`;
    document.querySelector(".weather-city").textContent = data.name;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

// Countdown functionality
function updateCountdown() {
  const deadlineTimeElement = document.getElementById("deadlineTime");
  const addCountdownIcon = document.getElementById("addCountdown");
  const countdownData = JSON.parse(localStorage.getItem("countdown"));
  if (!countdownData) {
    deadlineTimeElement.textContent = "--";
    deadlineTimeElement.classList.add("hidden");
    addCountdownIcon.classList.remove("hidden");
    return;
  }
  const { endDate } = countdownData;
  const deadline = new Date(endDate);
  const now = new Date();
  if (now >= deadline) {
    localStorage.removeItem("countdown");
    deadlineTimeElement.textContent = "--";
    deadlineTimeElement.classList.add("hidden");
    addCountdownIcon.classList.remove("hidden");
    showDeadlinePopup();
  } else {
    const timeRemaining = deadline - now;
    const totalDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    deadlineTimeElement.textContent =
      totalDays >= 1
        ? `${totalDays} day(s) left`
        : `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
    deadlineTimeElement.classList.remove("hidden");
    addCountdownIcon.classList.add("hidden");
  }
}

// Function to show deadline end popup
function showDeadlinePopup() {
  const popup = document.createElement("div");
  popup.id = "deadlineEndPopup";
  popup.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background-color: #fff; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px; text-align: center; z-index: 1000;
  `;
  const message = document.createElement("h2");
  message.textContent = "Deadline has ended!";
  message.style.color = "#f44336";
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.cssText = `
    margin-top: 20px; padding: 10px 20px; background-color: #f44336;
    color: #fff; border: none; border-radius: 4px; cursor: pointer;
  `;
  closeButton.addEventListener("click", () => document.body.removeChild(popup));
  popup.appendChild(message);
  popup.appendChild(closeButton);
  document.body.appendChild(popup);
}

// Focus countdown functionality
function updateFocusCountdown() {
  const focusData = JSON.parse(localStorage.getItem("focusData"));
  if (!focusData) {
    document.getElementById("focusCountdown").textContent = "";
    document.getElementById("focusIcon").style.display = "block";
    document.getElementById("focusCountdown").style.display = "none";
    return;
  }
  const { endTime } = focusData;
  const now = new Date();
  const deadline = new Date(endTime);
  if (now >= deadline) {
    localStorage.removeItem("focusData");
    document.getElementById("focusCountdown").textContent = "Focus time ended";
    document.getElementById("focusIcon").style.display = "block";
  } else {
    const timeRemaining = deadline - now;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    document.getElementById("focusCountdown").textContent = `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    document.getElementById("focusIcon").style.display = "none";
    setTimeout(updateFocusCountdown, 1000);
  }
}

// Start focus timer
function startFocusTimer() {
  const focusData = JSON.parse(localStorage.getItem("focusData"));
  if (!focusData) return;
  const { endTime } = focusData;
  const now = new Date();
  const deadline = new Date(endTime);
  if (now >= deadline) {
    localStorage.removeItem("focusData");
    document.getElementById("focusCountdown").textContent = "Focus time ended";
    document.getElementById("focusIcon").style.display = "block";
    return;
  }
  updateFocusCountdown();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") clearInterval(focusInterval);
    else startFocusTimer();
  });
}

// Event listeners for popups
document.getElementById("addLinks").addEventListener("click", () => {
  document.getElementById("links-popup").style.display = "flex";
});
document.getElementById("closeLinksPopup").addEventListener("click", () => {
  document.getElementById("links-popup").style.display = "none";
});
document.getElementById("showFocusPopup").addEventListener("click", () => {
  document.getElementById("focus-popup").style.display = "flex";
});
document.getElementById("closeFocusPopup").addEventListener("click", () => {
  document.getElementById("focus-popup").style.display = "none";
});
document.getElementById("addCountdown").addEventListener("click", () => {
  document.getElementById("description").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("countdown-popup").style.display = "flex";
});
document.getElementById("closePopup").addEventListener("click", () => {
  document.getElementById("countdown-popup").style.display = "none";
});
document.getElementById("setCountdownButton").addEventListener("click", () => {
  const description = document.getElementById("description").value;
  const endDate = document.getElementById("endDate").value;
  if (!description || !endDate) {
    alert("Please fill in all fields");
    return;
  }
  localStorage.setItem("countdown", JSON.stringify({ description, endDate }));
  document.getElementById("countdown-popup").style.display = "none";
  updateCountdown();
});
document.getElementById("deadlineTime").addEventListener("click", () => {
  const countdownData = JSON.parse(localStorage.getItem("countdown"));
  if (countdownData) {
    document.getElementById("description").value = countdownData.description;
    document.getElementById("endDate").value = countdownData.endDate;
  }
  document.getElementById("countdown-popup").style.display = "flex";
});
document.getElementById("startFocus").addEventListener("click", () => {
  const hours = parseInt(document.getElementById("focusHours").value, 10);
  const minutes = parseInt(document.getElementById("focusMinutes").value, 10);
  if (isNaN(hours) || isNaN(minutes)) {
    alert("Please enter valid numbers for hours and minutes.");
    return;
  }
  const endTime = new Date(
    Date.now() + hours * 60 * 60 * 1000 + minutes * 60 * 1000
  ).toISOString();
  localStorage.setItem("focusData", JSON.stringify({ endTime }));
  document.getElementById("focusIcon").style.display = "none";
  document.getElementById("focus-popup").style.display = "none";
  document.getElementById("focusCountdown").style.display = "block";
  updateFocusCountdown();
});

// Google Calendar Integration
function initGoogleAPI() {
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: CONFIG.GOOGLE_API_KEY,
        clientId: CONFIG.GOOGLE_CLIENT_ID,
        discoveryDocs: [CONFIG.DISCOVERY_DOC],
        scope: CONFIG.SCOPES,
      })
      .then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      })
      .catch((error) => {
        console.error("Error initializing Google API client:", error);
      });
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) loadCalendarEvents();
  else gapi.auth2.getAuthInstance().signIn();
}

function loadCalendarEvents() {
  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    })
    .then((response) => {
      const events = response.result.items;
      const eventsContainer = document.getElementById("calendarEvents");
      eventsContainer.innerHTML = "";
      if (events.length > 0) {
        events.forEach((event) => {
          const start = event.start.dateTime || event.start.date;
          const eventElement = document.createElement("div");
          eventElement.textContent = `${start} - ${event.summary}`;
          eventsContainer.appendChild(eventElement);
        });
      } else {
        eventsContainer.textContent = "No upcoming events found.";
      }
    })
    .catch((error) => {
      console.error("Error fetching calendar events:", error);
    });
}

document.getElementById("showCalendarPopup").addEventListener("click", () => {
  document.getElementById("calendar-popup").style.display = "flex";
  if (gapi.auth2.getAuthInstance().isSignedIn.get()) loadCalendarEvents();
  else gapi.auth2.getAuthInstance().signIn();
});

document.getElementById("closeCalendarPopup").addEventListener("click", () => {
  document.getElementById("calendar-popup").style.display = "none";
});

document.getElementById("addEventButton").addEventListener("click", () => {
  document.getElementById("addEventForm").style.display = "block";
  document.getElementById("calendarEvents").style.display = "none";
});

document.getElementById("cancelAddEvent").addEventListener("click", () => {
  document.getElementById("addEventForm").style.display = "none";
  document.getElementById("calendarEvents").style.display = "block";
});

document.getElementById("submitEvent").addEventListener("click", () => {
  const summary = document.getElementById("eventSummary").value;
  const start = document.getElementById("eventStart").value;
  const end = document.getElementById("eventEnd").value;
  const event = {
    summary: summary,
    start: { dateTime: start, timeZone: "Asia/Kolkata" },
    end: { dateTime: end, timeZone: "Asia/Kolkata" },
  };
  gapi.client.calendar.events
    .insert({
      calendarId: "primary",
      resource: event,
    })
    .then((response) => {
      console.log("Event created: " + response.htmlLink);
      document.getElementById("addEventForm").style.display = "none";
      document.getElementById("calendarEvents").style.display = "block";
      loadCalendarEvents();
    })
    .catch((error) => {
      console.error("Error creating event:", error);
    });
});

// Links management
document.addEventListener("DOMContentLoaded", () => {
  const showAddLinkForm = document.getElementById("showAddLinkForm");
  const linksForm = document.getElementById("linksForm");
  const cancelAddLink = document.getElementById("cancelAddLink");
  const savedLinksContainer = document.getElementById("savedLinks");
  const submitLink = document.getElementById("submitLink");

  showAddLinkForm.addEventListener("click", () => {
    linksForm.style.display = "block";
    savedLinksContainer.style.display = "none";
  });
  cancelAddLink.addEventListener("click", () => {
    linksForm.style.display = "none";
    savedLinksContainer.style.display = "block";
  });
  submitLink.addEventListener("click", () => {
    const linkTitle = document.getElementById("linkTitle").value;
    const linkURL = document.getElementById("linkURL").value;
    const links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links.push({ title: linkTitle, url: linkURL });
    localStorage.setItem("savedLinks", JSON.stringify(links));
    linksForm.style.display = "none";
    savedLinksContainer.style.display = "block";
    loadSavedLinks();
  });

  function loadSavedLinks() {
    const links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    savedLinksContainer.innerHTML = "";
    links.forEach((link, index) => {
      const linkElement = document.createElement("a");
      linkElement.href = link.url;
      linkElement.target = "_blank";
      const favicon = document.createElement("img");
      favicon.src = `https://www.google.com/s2/favicons?domain=${
        new URL(link.url).hostname
      }`;
      favicon.classList.add("favicon");
      const titleElement = document.createElement("span");
      titleElement.textContent = link.title;
      titleElement.classList.add("link-title");
      const deleteIcon = document.createElement("img");
      deleteIcon.src = "../assets/icons/delete.svg";
      deleteIcon.classList.add("delete-icon");
      deleteIcon.addEventListener("click", (e) => {
        e.preventDefault();
        deleteLink(index);
      });
      linkElement.appendChild(favicon);
      linkElement.appendChild(titleElement);
      linkElement.appendChild(deleteIcon);
      savedLinksContainer.appendChild(linkElement);
    });
  }

  function deleteLink(index) {
    const links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links.splice(index, 1);
    localStorage.setItem("savedLinks", JSON.stringify(links));
    loadSavedLinks();
  }

  loadSavedLinks();
  initGoogleAPI();
  fetchRandomBackground();
  fetchQuote();
  startFocusTimer();
});

// Periodic updates
setInterval(updateTime, 1000);
updateTime();
setGreeting();
setInterval(updateCountdown, 1000);
updateCountdown();
fetchWeather();

// Fetch city time
async function fetchCityTime(city) {
  try {
    const response = await fetch(
      `https://worldtimeapi.org/api/timezone/${city}`
    );
    const data = await response.json();
    const cityName = city.split("/")[1].replace("_", " ");
    const datetime = new Date(data.datetime);
    const time = datetime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    console.log(`Local Time in ${cityName}: ${time}`);
  } catch (error) {
    console.error("Error fetching city time:", error);
  }
}
fetchCityTime("Asia/Kolkata");

// Fetch quote
async function fetchQuote() {
  try {
    const response = await fetch("https://api.quotable.io/random");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    if (data.content && data.author) {
      const quoteElement = document.getElementById("quote");
      quoteElement.textContent = `"${data.content}" — ${data.author}`;
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
}

// Fetch random background
async function fetchRandomBackground() {
  const query = "mountain nature";
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query
  )}&per_page=1&page=${Math.floor(Math.random() * 1000)}`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: CONFIG.PEXELS_API_KEY },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      document.getElementById(
        "background"
      ).style.backgroundImage = `url(${data.photos[0].src.original})`;
    }
  } catch (error) {
    console.error("Error fetching background:", error);
    document.getElementById("background").style.backgroundImage =
      "url(./assets/bg.jpg)";
  }
}
