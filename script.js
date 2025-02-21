const colorRanges = [
  { min: 100, max: Infinity, color: "Bright Orange" },
  { min: 89, max: 100, color: "Yellow" },
  { min: 78, max: 88, color: "Pink" },
  { min: 67, max: 77, color: "Turqoise" },
  { min: 54, max: 66, color: "Purple" },
  { min: 44, max: 53, color: "Light Pink" },
  { min: 33, max: 43, color: "Dark Green" },
  { min: 21, max: 32, color: "Light Purple" },
  { min: 1, max: 20, color: "Blue" },
  { min: -Infinity, max: 0, color: "Light Blue" },
];

function getYarnColor(temperature) {
  const range = colorRanges.find(
    (range) => temperature >= range.min && temperature <= range.max
  );
  return range ? range.color : "N/A";
}

async function fetchTemperature() {
  try {
    // First fetch the config from our server
    const configResponse = await fetch("/config");
    if (!configResponse.ok) {
      throw new Error("Failed to load configuration");
    }
    const config = await configResponse.json();

    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${config.LAT}&lon=${config.LON}&exclude=current,minutely,hourly,alerts&appid=${config.WEATHER_API_KEY}&units=imperial`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Math.round(data.daily[0].temp.max);
  } catch (error) {
    console.error("Error fetching temperature:", error);
    return null;
  }
}

function addTableRow(date, temperature, color) {
  const tableBody = document.getElementById("tableBody");
  const row = document.createElement("tr");

  row.innerHTML = `
        <td>${date}</td>
        <td>${temperature}°F</td>
        <td>${color}</td>
    `;

  tableBody.insertBefore(row, tableBody.firstChild);
}

async function updateTable() {
  const temperature = await fetchTemperature();
  if (temperature === null) return;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const color = getYarnColor(temperature);
  addTableRow(today, temperature, color);

  // Save to localStorage
  const savedData = JSON.parse(localStorage.getItem("temperatureData") || "[]");
  savedData.unshift({ date: today, temperature, color });
  localStorage.setItem("temperatureData", JSON.stringify(savedData));
}

// Load saved data on page load
window.addEventListener("load", () => {
  const savedData = JSON.parse(localStorage.getItem("temperatureData") || "[]");
  savedData.forEach(({ date, temperature, color }) => {
    addTableRow(date, temperature, color);
  });
});

// Check if it's time to update (7am EST)
function checkUpdateTime() {
  const now = new Date();
  const est = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  if (est.getHours() === 7 && est.getMinutes() === 0) {
    updateTable();
  }
}

// Check every minute if it's time to update
setInterval(checkUpdateTime, 60000);
