const weatherApiKey = YOUR_WEATHER_API_KEY;
const pexelsApiKey = YOUR_PEXELS_API_KEY;


// Function to update the time
function updateTime() {
  const timeElement = document.getElementById("time");
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12;
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursStr = hours.toString().padStart(2, "0");
  timeElement.textContent = `${hoursStr}:${minutes}`;
}

// Function to set greeting message based on the time
function setGreeting() {
  const greetingElement = document.getElementById("greeting");
  const hours = new Date().getHours();
  let greeting = "Good evening";

  if (hours >= 5 && hours < 12) {
    greeting = "Good morning";
  } else if (hours >= 12 && hours < 17) {
    greeting = "Good afternoon";
  }

  greetingElement.textContent = greeting + ", Pranav.";
}

// Function to fetch weather data from OpenWeatherMap API
async function fetchWeather(lat = null, lon = null) {
  const apiKey = weatherApiKey; // Use your API key here

  const url =
    lat && lon
      ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      : `https://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const temperature = data.main.temp;
    const city = data.name;

    const weatherTitle = document.querySelector(".weather-title");
    const weatherCity = document.querySelector(".weather-city");

    weatherTitle.textContent = `${temperature}°C`;
    weatherCity.textContent = city;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
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

  const { description, endDate } = countdownData;
  const deadline = new Date(endDate);
  const now = new Date();

  if (now >= deadline) {
    localStorage.removeItem("countdown");
    deadlineTimeElement.textContent = "--";
    deadlineTimeElement.classList.add("hidden");
    addCountdownIcon.classList.remove("hidden");
    showDeadlinePopup(); // Show the popup when the deadline ends
  } else {
    const timeRemaining = deadline - now;
    const totalDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (totalDays >= 1) {
      // Show days left when there is more than 24 hours
      deadlineTimeElement.textContent = `${totalDays} day(s) left`;
    } else {
      // Show hours and minutes when less than 24 hours
      deadlineTimeElement.textContent = `${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }

    deadlineTimeElement.classList.remove("hidden");
    addCountdownIcon.classList.add("hidden");
  }
}

// Function to show the deadline end popup
function showDeadlinePopup() {
  const popup = document.createElement("div");
  popup.id = "deadlineEndPopup";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "#fff";
  popup.style.padding = "20px";
  popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  popup.style.borderRadius = "8px";
  popup.style.textAlign = "center";
  popup.style.zIndex = "1000";

  const message = document.createElement("h2");
  message.textContent = "Deadline has ended!";
  message.style.color = "#f44336"; // Set text color

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.marginTop = "20px";
  closeButton.style.padding = "10px 20px";
  closeButton.style.backgroundColor = "#f44336";
  closeButton.style.color = "#fff";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "4px";
  closeButton.style.cursor = "pointer";

  closeButton.addEventListener("click", () => {
    document.body.removeChild(popup);
  });

  popup.appendChild(message);
  popup.appendChild(closeButton);
  document.body.appendChild(popup);
}

// Function to update the focus countdown display
function updateFocusCountdown() {
  const focusData = JSON.parse(localStorage.getItem("focusData"));
  if (!focusData) {
    document.getElementById("focusCountdown").textContent = "";
    document.getElementById("focusIcon").style.display = "block"; // Ensure icon is shown when no focus time is set
    document.getElementById("focusCountdown").style.display = "none"; // Hide the countdown when no focus time is set
    return;
  }

  const { endTime } = focusData;
  const now = new Date();
  const deadline = new Date(endTime);

  if (now >= deadline) {
    // Focus time has ended
    localStorage.removeItem("focusData");
    document.getElementById("focusCountdown").textContent = "Focus time ended";
    document.getElementById("focusIcon").style.display = "block"; // Show the focus icon again
  } else {
    const timeRemaining = deadline - now;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    document.getElementById("focusCountdown").textContent = `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    document.getElementById("focusIcon").style.display = "none"; // Hide the icon when focus time is active
    setTimeout(updateFocusCountdown, 1000); // Update every second
  }
}

// Function to handle the focus form submission
document.getElementById("focusForm").addEventListener("submit", (e) => {
  e.preventDefault();
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

  // Hide focus icon and show countdown
  document.getElementById("focusIcon").style.display = "none";
  document.getElementById("focusPopup").style.display = "none";
  document.getElementById("focusCountdown").style.display = "block";

  // Refresh the page
  location.reload();

  updateFocusCountdown();
});

// Function to toggle focus mode visibility
function toggleFocusModeVisibility() {
  const focusIcon = document.getElementById("focusIcon");
  const focusCountdown = document.getElementById("focusCountdown");

  if (isFocusModeActive) {
    focusIcon.style.display = "none"; // Hide the focus icon
    focusCountdown.style.display = "block"; // Show the focus countdown
  } else {
    focusIcon.style.display = "block"; // Show the focus icon
    focusCountdown.style.display = "none"; // Hide the focus countdown
  }
}

// Function to start focus timer and setup visibility change event listener
function startFocusTimer() {
  const focusData = JSON.parse(localStorage.getItem("focusData"));
  if (!focusData) return;

  const { endTime } = focusData;
  const now = new Date();
  const deadline = new Date(endTime);

  if (now >= deadline) {
    // Focus time has ended
    localStorage.removeItem("focusData");
    document.getElementById("focusCountdown").textContent = "Focus time ended";
    document.getElementById("focusIcon").style.display = "block"; // Show the focus icon again
    return;
  }

  updateFocusCountdown();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // Pause the timer when the tab is not visible
      clearInterval(focusInterval);
    } else {
      // Resume the timer when the tab becomes visible again
      startFocusTimer();
    }
  });
}

// Event listener for showing the "Add Links" popup
document.getElementById("addLinks").addEventListener("click", () => {
  document.getElementById("links-popup").style.display = "flex"; // Make the popup visible
});

// Event listener for closing the "Add Links" popup
document.getElementById("closeLinksPopup").addEventListener("click", () => {
  document.getElementById("links-popup").style.display = "none"; // Hide the popup
});

// Event listener for showing the "Focus" popup
document.getElementById("showFocusPopup").addEventListener("click", () => {
  document.getElementById("focus-popup").style.display = "flex"; // Make the focus popup visible
});

// Event listener for closing the "Focus" popup
document.getElementById("closeFocusPopup").addEventListener("click", () => {
  document.getElementById("focus-popup").style.display = "none"; // Hide the popup
});

// Event listeners for countdown popup
document.getElementById("addCountdown").addEventListener("click", () => {
  // Clear the form for new countdown
  document.getElementById("description").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("countdown-popup").style.display = "flex";
});

document.getElementById("closePopup").addEventListener("click", () => {
  document.getElementById("countdown-popup").style.display = "none";
});

document.getElementById("countdownForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value;
  const endDate = document.getElementById("endDate").value;

  if (!description || !endDate) {
    alert("Please fill in all fields");
    return;
  }

  const countdownData = { description, endDate };
  localStorage.setItem("countdown", JSON.stringify(countdownData));

  document.getElementById("countdown-popup").style.display = "none";
  updateCountdown();
});

// Handle the click on deadline time to open the popup with pre-filled data
document.getElementById("deadlineTime").addEventListener("click", () => {
  const countdownData = JSON.parse(localStorage.getItem("countdown"));

  if (countdownData) {
    // Pre-fill the form with existing data
    document.getElementById("description").value = countdownData.description;
    document.getElementById("endDate").value = countdownData.endDate;
  }

  document.getElementById("countdown-popup").style.display = "flex";
});

// Update time and greeting every minute
setInterval(updateTime, 1000);
updateTime();
setGreeting();

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Fetch weather data (default location: Pune)
fetchWeather();

// Added feature: Display local time of any specified city
async function fetchCityTime(city) {
  try {
    const response = await fetch(
      `https://worldtimeapi.org/api/timezone/${city}`
    );
    const data = await response.json();

    const cityTimeElement = document.getElementById("city-time");
    const cityName = city.split("/")[1].replace("_", " ");

    const datetime = new Date(data.datetime);
    const time = datetime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    cityTimeElement.textContent = `Local Time in ${cityName}: ${time}`;
  } catch (error) {
    console.error("Error fetching city time:", error);
  }
}

// Fetch the local time of a specific city (e.g., 'Asia/Kolkata')
fetchCityTime("Asia/Kolkata");

// Save links to localStorage and display them
document.addEventListener("DOMContentLoaded", function () {
  const linksPopup = document.getElementById("links-popup");
  const showLinksPopup = document.getElementById("showLinksPopup");
  const closeLinksPopup = document.getElementById("closeLinksPopup");
  const showAddLinkForm = document.getElementById("showAddLinkForm");
  const linksForm = document.getElementById("linksForm");
  const cancelAddLink = document.getElementById("cancelAddLink");
  const savedLinksContainer = document.getElementById("savedLinks");

  // Show links popup
  showLinksPopup.addEventListener("click", () => {
    linksPopup.style.display = "block";
    loadSavedLinks(); // Load saved links when opening popup
    savedLinksContainer.style.display = "block"; // Ensure links are visible
    linksForm.style.display = "none"; // Ensure form is hidden initially
  });

  // Close links popup
  closeLinksPopup.addEventListener("click", () => {
    linksPopup.style.display = "none";
  });

  // Show form to add link and hide saved links
  showAddLinkForm.addEventListener("click", () => {
    linksForm.style.display = "block"; // Show the form
    savedLinksContainer.style.display = "none"; // Hide the saved links
  });

  // Cancel adding a link
  cancelAddLink.addEventListener("click", () => {
    linksForm.reset();
    linksForm.style.display = "none"; // Hide the form
    savedLinksContainer.style.display = "block"; // Show the saved links again
  });

  // Add link to local storage and render it
  linksForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const linkTitle = document.getElementById("linkTitle").value;
    const linkURL = document.getElementById("linkURL").value;

    // Save the link to localStorage
    const links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links.push({ title: linkTitle, url: linkURL });
    localStorage.setItem("savedLinks", JSON.stringify(links));

    // Reset form and hide it
    linksForm.reset();
    linksForm.style.display = "none";

    // Show saved links again
    savedLinksContainer.style.display = "block";

    // Reload the saved links
    loadSavedLinks();
  });

  // Load saved links from localStorage and display them
  function loadSavedLinks() {
    const links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    savedLinksContainer.innerHTML = ""; // Clear previous links

    links.forEach((link, index) => {
      const linkElement = document.createElement("a");
      linkElement.href = link.url;
      linkElement.target = "_blank"; // Open in new tab

      // Create the favicon element
      const favicon = document.createElement("img");
      favicon.src = `https://www.google.com/s2/favicons?domain=${
        new URL(link.url).hostname
      }`;
      favicon.classList.add("favicon");

      // Create the title element
      const titleElement = document.createElement("span");
      titleElement.textContent = link.title;
      titleElement.classList.add("link-title");

      // Create the delete icon
      const deleteIcon = document.createElement("img");
      deleteIcon.src = "../assets/icons/delete.svg"; // Replace with your delete icon path
      deleteIcon.classList.add("delete-icon");
      deleteIcon.addEventListener("click", (e) => {
        e.preventDefault();
        deleteLink(index);
      });

      // Append elements to the link element
      linkElement.appendChild(favicon);
      linkElement.appendChild(titleElement);
      linkElement.appendChild(deleteIcon);

      savedLinksContainer.appendChild(linkElement);
    });
  }

  // Function to delete a link from localStorage
  function deleteLink(index) {
    const links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links.splice(index, 1); // Remove the link at the given index
    localStorage.setItem("savedLinks", JSON.stringify(links)); // Save the updated list
    loadSavedLinks(); // Reload the links
  }

  // Initial load of saved links
  loadSavedLinks();
});

async function fetchQuote() {
  try {
    const response = await fetch("https://api.quotable.io/random");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);

    if (data && data.content && data.author) {
      const quoteElement = document.getElementById("quote");
      quoteElement.textContent = `"${data.content}" — ${data.author}`;
    } else {
      console.error("Invalid data structure:", data);
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    const quoteElement = document.getElementById("quote");
    quoteElement.textContent = "Failed to load quote.";
  }
}

// Fetch a new quote on page load
document.addEventListener("DOMContentLoaded", fetchQuote);


async function fetchRandomBackground() {
  const apiKey = pexelsApiKey; 
  const query = 'mountain nature';
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&page=${Math.floor(Math.random() * 1000)}`; // Random page number

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data && data.photos && data.photos.length > 0 && data.photos[0].src && data.photos[0].src.original) {
      const imageUrl = data.photos[0].src.original;
      document.getElementById('background').style.backgroundImage = `url(${imageUrl})`;
    } else {
      console.error("Invalid data structure:", data);
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    // Fallback to a default background image or color
    document.getElementById('background').style.backgroundImage = 'url(./assets/bg.jpg)';
  }
}

// Fetch a new background image on page load
document.addEventListener('DOMContentLoaded', fetchRandomBackground);



// Start focus timer if there is any existing focus data
startFocusTimer();
