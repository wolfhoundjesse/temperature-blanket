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

  // Add click handler to the row
  row.addEventListener("click", () => handleRowClick(date));

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

// Function to insert historical data with corrected colors
function insertHistoricalData() {
  const historicalData = [
    { date: "1/1/25", temp: 47, color: "Light Pink" },
    { date: "1/2/25", temp: 40, color: "Dark Green" },
    { date: "1/3/25", temp: 42, color: "Dark Green" },
    { date: "1/4/25", temp: 31, color: "Light Purple" },
    { date: "1/5/25", temp: 34, color: "Dark Green" },
    { date: "1/6/25", temp: 31, color: "Light Purple" },
    { date: "1/7/25", temp: 33, color: "Dark Green" },
    { date: "1/8/25", temp: 29, color: "Light Purple" },
    { date: "1/9/25", temp: 30, color: "Light Purple" },
    { date: "1/10/25", temp: 34, color: "Dark Green" },
    { date: "1/11/25", temp: 34, color: "Dark Green" },
    { date: "1/12/25", temp: 38, color: "Dark Green" },
    { date: "1/13/25", temp: 44, color: "Light Pink" },
    { date: "1/14/25", temp: 33, color: "Dark Green" },
    { date: "1/15/25", temp: 31, color: "Light Purple" },
    { date: "1/16/25", temp: 33, color: "Dark Green" },
    { date: "1/17/25", temp: 42, color: "Dark Green" },
    { date: "1/18/25", temp: 45, color: "Light Pink" },
    { date: "1/19/25", temp: 36, color: "Dark Green" },
    { date: "1/20/25", temp: 27, color: "Light Purple" },
    { date: "1/21/25", temp: 20, color: "Blue" },
    { date: "1/22/25", temp: 23, color: "Light Purple" },
    { date: "1/23/25", temp: 31, color: "Light Purple" },
    { date: "1/24/25", temp: 34, color: "Dark Green" },
    { date: "1/25/25", temp: 37, color: "Dark Green" },
    { date: "1/26/25", temp: 43, color: "Dark Green" },
    { date: "1/27/25", temp: 42, color: "Dark Green" },
    { date: "1/28/25", temp: 45, color: "Light Pink" },
    { date: "1/30/25", temp: 43, color: "Dark Green" },
    { date: "1/31/25", temp: 52, color: "Light Pink" },
    { date: "2/1/25", temp: 53, color: "Light Pink" },
    { date: "2/2/25", temp: 39, color: "Dark Green" },
    { date: "2/3/25", temp: 51, color: "Light Pink" },
    { date: "2/4/25", temp: 53, color: "Light Pink" },
    { date: "2/5/25", temp: 37, color: "Dark Green" },
    { date: "2/6/25", temp: 51, color: "Light Pink" },
    { date: "2/8/25", temp: 36, color: "Dark Green" },
    { date: "2/10/25", temp: 42, color: "Dark Green" },
    { date: "2/12/25", temp: 37, color: "Dark Green" },
    { date: "2/13/25", temp: 52, color: "Light Pink" },
    { date: "2/14/25", temp: 39, color: "Dark Green" },
    { date: "2/15/25", temp: 43, color: "Dark Green" },
    { date: "2/16/25", temp: 59, color: "Purple" },
    { date: "2/17/25", temp: 38, color: "Dark Green" },
    { date: "2/18/25", temp: 32, color: "Light Purple" },
    { date: "2/19/25", temp: 28, color: "Light Purple" },
    { date: "2/21/25", temp: 37, color: "Dark Green" },
  ];

  // Clear existing data
  localStorage.clear();
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  // Insert each record
  historicalData.reverse().forEach(({ date, temp, color }) => {
    addTableRow(date, temp, color);
  });
}

// Add these styles to mark completed rows
const style = document.createElement("style");
style.textContent = `
  .completed-row {
    background-color: #e8f5e9 !important;  /* Light green background */
  }
  tr {
    cursor: pointer;  /* Show pointer cursor on rows */
  }
`;
document.head.appendChild(style);

async function loadHistoricalData() {
  try {
    const response = await fetch("/temperature-data");
    if (!response.ok) {
      throw new Error("Failed to load temperature data");
    }
    const data = await response.json();

    // Clear existing table
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    // Add each record to the table
    data.temperatures.reverse().forEach(({ date, temp, color }) => {
      addTableRow(date, temp, color);
    });

    // Mark completed rows if lastCompletedRow exists
    if (data.lastCompletedRow) {
      markCompletedRows(data.lastCompletedRow);
    }
  } catch (error) {
    console.error("Error loading temperature data:", error);
  }
}

async function handleRowClick(clickedDate) {
  try {
    // Update the server with the new lastCompletedRow
    const response = await fetch("/update-completed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lastCompletedRow: clickedDate }),
    });

    if (!response.ok) {
      throw new Error("Failed to update completed rows");
    }

    // Update the UI
    markCompletedRows(clickedDate);
  } catch (error) {
    console.error("Error updating completed rows:", error);
  }
}

function markCompletedRows(lastCompletedDate) {
  const rows = document.querySelectorAll("#tableBody tr");
  const lastCompleted = new Date(lastCompletedDate);

  rows.forEach((row) => {
    const rowDate = new Date(row.cells[0].textContent);
    // Ensure we're comparing just the dates, not the times
    if (rowDate.setHours(0, 0, 0, 0) <= lastCompleted.setHours(0, 0, 0, 0)) {
      row.classList.add("completed-row");
    } else {
      row.classList.remove("completed-row");
    }
  });
}

// Call this function when the page loads
window.addEventListener("load", loadHistoricalData);
