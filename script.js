// Function to update the time
function updateTime() {
    const timeElement = document.getElementById("time");
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12;
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursStr = hours.toString().padStart(2, '0');
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
    const apiKey = '692b3dfdc40feb9d03632df5d939a365'; // Use your API key here

    const url = lat && lon
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        : `https://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const temperature = data.main.temp;
        const city = data.name;

        const weatherTitle = document.querySelector('.weather-title');
        const weatherCity = document.querySelector('.weather-city');

        weatherTitle.textContent = `${temperature}°C`;
        weatherCity.textContent = city;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Countdown functionality
function updateCountdown() {
    const deadlineTimeElement = document.getElementById('deadlineTime');
    const addCountdownIcon = document.getElementById('addCountdown');

    const countdownData = JSON.parse(localStorage.getItem('countdown'));
    if (!countdownData) {
        deadlineTimeElement.textContent = '--';
        deadlineTimeElement.classList.add('hidden');
        addCountdownIcon.classList.remove('hidden');
        return;
    }

    const { description, endDate } = countdownData;
    const deadline = new Date(endDate);
    const now = new Date();

    if (now >= deadline) {
        localStorage.removeItem('countdown');
        deadlineTimeElement.textContent = '--';
        deadlineTimeElement.classList.add('hidden');
        addCountdownIcon.classList.remove('hidden');
        showDeadlinePopup();  // Show the popup when the deadline ends
    } else {
        const timeRemaining = deadline - now;
        const totalDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        if (totalDays >= 1) {
            // Show days left when there is more than 24 hours
            deadlineTimeElement.textContent = `${totalDays} day(s) left`;
        } else {
            // Show hours and minutes when less than 24 hours
            deadlineTimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

        deadlineTimeElement.classList.remove('hidden');
        addCountdownIcon.classList.add('hidden');
    }
}

// Function to show the deadline end popup
function showDeadlinePopup() {
    const popup = document.createElement('div');
    popup.id = 'deadlineEndPopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = '#fff';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.borderRadius = '8px';
    popup.style.textAlign = 'center';
    popup.style.zIndex = '1000';

    const message = document.createElement('h2');
    message.textContent = 'Deadline has ended!';
    message.style.color = '#f44336'; // Set text color

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(popup);
    });

    popup.appendChild(message);
    popup.appendChild(closeButton);
    document.body.appendChild(popup);
}

// Event listeners
document.getElementById('addCountdown').addEventListener('click', () => {
    // Clear the form for new countdown
    document.getElementById('description').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('popup').style.display = 'flex';
});

document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
});

document.getElementById('countdownForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const endDate = document.getElementById('endDate').value;

    if (!description || !endDate) {
        alert('Please fill in all fields');
        return;
    }

    const countdownData = { description, endDate };
    localStorage.setItem('countdown', JSON.stringify(countdownData));

    document.getElementById('popup').style.display = 'none';
    updateCountdown();
});

// Handle the click on deadline time to open the popup with pre-filled data
document.getElementById('deadlineTime').addEventListener('click', () => {
    const countdownData = JSON.parse(localStorage.getItem('countdown'));

    if (countdownData) {
        // Pre-fill the form with existing data
        document.getElementById('description').value = countdownData.description;
        document.getElementById('endDate').value = countdownData.endDate;
    }

    document.getElementById('popup').style.display = 'flex';
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
