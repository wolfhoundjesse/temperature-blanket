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

function addMonthHeader(date) {
  const [month, , year] = date.split("/");
  const monthName = MONTHS[parseInt(month) - 1];
  const tableBody = document.getElementById("tableBody");
  const row = document.createElement("tr");
  row.className = "month-header";

  // Calculate top position for sticky behavior
  const top = document.querySelector("thead").offsetHeight;
  row.style.top = `${top}px`;

  const cell = document.createElement("td");
  cell.colSpan = 3;

  // Check if month image exists
  const img = new Image();
  const imgPath = `/images/months/${monthName.toLowerCase()}.png`;

  img.onload = () => {
    cell.innerHTML = `<img src="${imgPath}" alt="${monthName} ${year}" />`;
  };

  img.onerror = () => {
    cell.innerHTML = `${monthName} ${year}`;
  };

  img.src = imgPath;

  row.appendChild(cell);
  tableBody.appendChild(row);
}

function addTableRow(date, temperature, color) {
  const tableBody = document.getElementById("tableBody");

  // Check if we need to add a month header
  const [month] = date.split("/");
  const lastRow = tableBody.lastElementChild;
  const lastDate = lastRow?.cells[0]?.textContent;
  const [lastMonth] = lastDate?.split("/") || [];

  if (!lastDate || month !== lastMonth) {
    addMonthHeader(date);
  }

  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${date}</td>
        <td>${temperature}°F</td>
        <td>${color}</td>
    `;

  // Add click handler to the row
  row.addEventListener("click", () => handleRowClick(date));

  tableBody.appendChild(row);
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

const DATA_VERSION = 1; // Used to check if local storage data needs migration

// Add refresh button to the page
const refreshButton = document.createElement("button");
refreshButton.textContent = "↻ Refresh Data";
refreshButton.style.cssText =
  "position: fixed; top: 20px; right: 20px; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;";
refreshButton.addEventListener("click", () => loadHistoricalData(true));
document.body.appendChild(refreshButton);

async function loadHistoricalData(forceRefresh = false) {
  try {
    let data;
    let shouldFetchFromServer = forceRefresh;

    if (!shouldFetchFromServer) {
      try {
        const localData = localStorage.getItem("temperatureData");
        if (localData) {
          const parsedData = JSON.parse(localData);

          // Version check
          if (parsedData.version !== DATA_VERSION) {
            shouldFetchFromServer = true;
          } else {
            // Check if data is stale (over 24 hours old)
            const lastUpdated = new Date(parsedData.lastUpdated);
            const now = new Date();
            if (now - lastUpdated > 24 * 60 * 60 * 1000) {
              shouldFetchFromServer = true;
            } else {
              data = parsedData;
            }
          }
        } else {
          shouldFetchFromServer = true;
        }
      } catch (e) {
        console.error("Error parsing local storage data:", e);
        shouldFetchFromServer = true;
      }
    }

    if (shouldFetchFromServer) {
      try {
        const response = await fetch("/temperature-data");
        if (!response.ok) throw new Error("Failed to load temperature data");
        data = await response.json();
        data.lastUpdated = new Date().toISOString();
        data.version = DATA_VERSION;
        localStorage.setItem("temperatureData", JSON.stringify(data));
      } catch (e) {
        if (!navigator.onLine) {
          alert("You're offline. Showing cached data if available.");
          data = JSON.parse(localStorage.getItem("temperatureData"));
          if (!data) throw new Error("No cached data available");
        } else {
          throw e;
        }
      }
    }

    updateUI(data);
  } catch (error) {
    console.error("Error loading temperature data:", error);
    showError("Failed to load data. Please try again later.");
  }
}

// Add after DATA_VERSION declaration
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function createMonthPicker(data) {
  const monthPicker = document.getElementById("monthPicker");
  monthPicker.innerHTML = "";

  // Get available months from data
  const availableMonths = new Set(
    data.temperatures.map((t) => {
      const [month] = t.date.split("/");
      return parseInt(month) - 1;
    })
  );

  MONTHS.forEach((month, index) => {
    const button = document.createElement("button");
    button.className = "month-button";
    button.textContent = month;
    button.disabled = !availableMonths.has(index);

    if (!button.disabled) {
      button.addEventListener("click", () => scrollToMonth(index + 1));
    }

    monthPicker.appendChild(button);
  });

  // Start monitoring scroll position
  observeTableScroll();
}

function scrollToMonth(monthNumber) {
  const rows = document.querySelectorAll("#tableBody tr");
  for (const row of rows) {
    const [month] = row.cells[0].textContent.split("/");
    if (parseInt(month) === monthNumber) {
      const container = document.querySelector(".table-container");
      container.scrollTop = row.offsetTop;
      // Trigger scroll event to update active state
      container.dispatchEvent(new Event("scroll"));
      break;
    }
  }
}

function observeTableScroll() {
  const container = document.querySelector(".table-container");
  const buttons = document.querySelectorAll(".month-button");

  const updateActiveMonth = () => {
    const rows = document.querySelectorAll("#tableBody tr");
    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // Find visible rows - check first row that's fully or partially visible
    let visibleMonth = null;
    for (const row of rows) {
      const rowTop = row.offsetTop - containerTop;
      // Consider row visible if it's slightly above or within viewport
      if (rowTop < 50) {
        // Allow 50px buffer above
        const [month] = row.cells[0].textContent.split("/");
        visibleMonth = parseInt(month) - 1;
      }
    }

    // Update active state
    buttons.forEach((button, index) => {
      button.classList.toggle("active", index === visibleMonth);
    });
  };

  // Listen for scroll events
  container.addEventListener("scroll", updateActiveMonth);

  // Initial update
  setTimeout(updateActiveMonth, 0);
}

// Modify updateUI function to include month picker
function updateUI(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  // Sort data from oldest to newest
  const sortedData = [...data.temperatures].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  sortedData.forEach(({ date, temp, color }) => {
    addTableRow(date, temp, color);
  });

  createMonthPicker(data);

  if (data.lastCompletedRow) {
    markCompletedRows(data.lastCompletedRow);
    setTimeout(scrollToLastCompleted, 0);
  }

  updateLastUpdatedDisplay(data.lastUpdated);
}

function updateLastUpdatedDisplay(timestamp) {
  let lastUpdatedDiv = document.getElementById("lastUpdated");
  const date = new Date(timestamp);
  lastUpdatedDiv.textContent = `Last updated: ${date.toLocaleString()}`;
}

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText =
    "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #f44336; color: white; padding: 10px; border-radius: 4px; z-index: 1000;";
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("ServiceWorker registration failed:", err);
    });
  });
}

async function handleRowClick(clickedDate) {
  try {
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

    // Update local storage
    const localData = JSON.parse(localStorage.getItem("temperatureData"));
    localData.lastCompletedRow = clickedDate;
    localStorage.setItem("temperatureData", JSON.stringify(localData));

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

function scrollToLastCompleted() {
  const lastCompletedDate = JSON.parse(
    localStorage.getItem("temperatureData")
  )?.lastCompletedRow;
  if (!lastCompletedDate) return;

  const rows = document.querySelectorAll("#tableBody tr");
  for (const row of rows) {
    if (row.cells[0].textContent === lastCompletedDate) {
      const container = document.querySelector(".table-container");
      const rowTop = row.offsetTop;
      const containerHeight = container.clientHeight;

      // Scroll to center the row
      container.scrollTop = rowTop - containerHeight / 2 + row.offsetHeight / 2;
      break;
    }
  }
}

// Add jump button handler
document
  .getElementById("jumpToLastCompleted")
  .addEventListener("click", scrollToLastCompleted);
