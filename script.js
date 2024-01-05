// Calculate the percentage of time passed for day, week, month, and year
function calculateTimePercentage() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const millisecondsInWeek = 7 * millisecondsInDay;
  const millisecondsInMonth = 30 * millisecondsInDay; // Approximation
  const millisecondsInYear = 365 * millisecondsInDay; // Approximation

  const dayPercentage = ((now - startOfDay) / millisecondsInDay) * 100;
  const weekPercentage = ((now - startOfWeek) / millisecondsInWeek) * 100;
  const monthPercentage = ((now - startOfMonth) / millisecondsInMonth) * 100;
  const yearPercentage = ((now - startOfYear) / millisecondsInYear) * 100;

  return {
    dayPercentage,
    weekPercentage,
    monthPercentage,
    yearPercentage,
  };
}

// Update the progress bars and percentages
function updateBars() {
  const percentages = calculateTimePercentage();

  document.getElementById('dayBar').style.width = percentages.dayPercentage + '%';
  document.getElementById('dayPercentage').textContent = formatPercentage(percentages.dayPercentage);

  document.getElementById('weekBar').style.width = percentages.weekPercentage + '%';
  document.getElementById('weekPercentage').textContent = formatPercentage(percentages.weekPercentage);

  document.getElementById('monthBar').style.width = percentages.monthPercentage + '%';
  document.getElementById('monthPercentage').textContent = formatPercentage(percentages.monthPercentage);

  document.getElementById('yearBar').style.width = percentages.yearPercentage + '%';
  document.getElementById('yearPercentage').textContent = formatPercentage(percentages.yearPercentage);
}

// Function to format percentage with leading zero if necessary
function formatPercentage(percentage) {
  return percentage.toFixed(2).padStart(5, '0') + '%';
}

// Update bars on page load
updateBars();

// Update bars every second to reflect the progress
setInterval(updateBars, 1000);


/* GitHub style Graph */
document.getElementById('birthdateForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Get the birthdate input value in the format DD/MM/YYYY
  const birthdateInput = document.getElementById('birthdateInput').value;
  const [day, month, year] = birthdateInput.split('/');

  // Calculate the age based on the birthdate
  const currentYear = new Date().getFullYear();
  const birthYear = parseInt(year, 10);
  const birthDate = new Date(birthYear, parseInt(month, 10) - 1, parseInt(day, 10));

  let age = currentYear - birthYear;
  const currentDate = new Date();

  if (currentDate < birthDate.setFullYear(currentYear)) {
    age--;
  }

  // Clear previous graph
  const commitsGraph = document.getElementById('commitsGraph');
  commitsGraph.innerHTML = '';

  // Create the commits graph based on the calculated age
  for (let i = 0; i < 100; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');

    if (i < age) {
      dot.style.backgroundColor = 'var(--teal)';
    } else {
      dot.style.backgroundColor = 'var(--text)';
    }

    commitsGraph.appendChild(dot);
  }

  // Hide birthdate input form and show the commits graph
  document.getElementById('birthdateForm').style.display = 'none';
  commitsGraph.style.display = 'grid';
});




document.getElementById('captureButton').addEventListener('click', function() {
  // Get the container element to be captured
  const targetElement = document.getElementById('chartContent');

  // Use HTML2Canvas library to capture the content
  html2canvas(targetElement).then(canvas => {
    // Convert canvas to base64 image data
    const imageData = canvas.toDataURL('image/png');

    // Create a link element to download the screenshot
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'screenshot.png'; // Set the filename for the downloaded image
    link.click();
  });
});

/* Age till 100 */

let interval; // Declare interval variable outside the scope

document.getElementById('birthdateForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const birthdateInput = new Date(document.getElementById('birthdateInput').value);

  // Calculate the remaining time to reach 100 years from the birth date
  const currentDate = new Date();
  const targetDate = new Date(birthdateInput.getFullYear() + 100, birthdateInput.getMonth(), birthdateInput.getDate());

  // Function to update the countdown timer
  function updateCountdown() {
    const now = new Date();
    const remainingTime = targetDate - now;

    if (remainingTime > 0) {
      const years = Math.floor(remainingTime / (1000 * 60 * 60 * 24 * 365.25));
      const months = Math.floor((remainingTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * (365.25 / 12)));
      const days = Math.floor((remainingTime % (1000 * 60 * 60 * 24 * (365.25 / 12))) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      const countdownDisplay = `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;

      const countdownTimer = document.getElementById('countdownTimer');
      countdownTimer.textContent = countdownDisplay;
      countdownTimer.classList.add('countdown-timer');
    } else {
      clearInterval(interval);
      document.getElementById('countdownTimer').textContent = 'You have reached 100 years!';
    }
  }

  // Initial call to update countdown
  updateCountdown();

  // Update the countdown every second
  interval = setInterval(updateCountdown, 1000); // Assign the interval here
});


/* Input focus */
// Function to set focus on the age input field
/* function setFocus() {
  document.getElementById('ageInput').focus();
} */
/* 
// Call the setFocus function when the page loads
window.addEventListener('load', setFocus);
 */