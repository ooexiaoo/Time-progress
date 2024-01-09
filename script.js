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

  const dayPercentage = Math.min(((now - startOfDay) / millisecondsInDay) * 100, 100);
  const weekPercentage = Math.min(((now - startOfWeek) / millisecondsInWeek) * 100, 100);
  const monthPercentage = Math.min(((now - startOfMonth) / millisecondsInMonth) * 100, 100);
  const yearPercentage = Math.min(((now - startOfYear) / millisecondsInYear) * 100, 100);

  return {
    dayPercentage,
    weekPercentage,
    monthPercentage,
    yearPercentage,
  };
}

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

function formatPercentage(percentage) {
  return percentage.toFixed(2).padStart(5, '0') + '%';
}

// Update bars every second
setInterval(updateBars, 1000);

// Initial update on page load
updateBars();


document.getElementById('birthdateInput').addEventListener('input', function (e) {
  let input = e.target.value.replace(/\D/g, '').substring(0, 8);
  input = input.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
  e.target.value = input;
});

document.getElementById('birthdateForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const birthdateInput = document.getElementById('birthdateInput').value;
  const birthDate = new Date(birthdateInput);
  const currentDate = new Date();

  // Calculate the age
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthsDiff = currentDate.getMonth() - birthDate.getMonth();

  if (monthsDiff < 0 || (monthsDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  console.log('Calculated Age:', age);

  const commitsGraph = document.getElementById('commitsGraph');
  commitsGraph.innerHTML = '';

  // Create the commits graph based on the calculated age
  for (let i = 0; i < 100; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');

    if (i < age) {
      dot.style.backgroundColor = 'var(--red)';
    } else {
      dot.style.backgroundColor = 'var(--teal)';
    }

    commitsGraph.appendChild(dot);
  }

  // Hide birthdate input form and show the commits graph
  document.getElementById('birthdateForm').style.display = 'none';
  commitsGraph.style.display = 'grid';

  // Show the time chart container
  document.getElementById('timeChartContainer').style.display = 'block';

  // Update the progress bars after age submission
  updateBars();
});



document.getElementById('captureButton').addEventListener('click', function() {
  // Get the container element to be captured
  const targetElement = document.getElementById('chartContent');

  // Use HTML2Canvas library to capture the content
  html2canvas(targetElement, {
    useCORS:true, // Cross-origin requests
  }).then(canvas => {
    // Convert canvas to base64 image data
    const imageData = canvas.toDataURL('image/png');

    // Create a link element to download the screenshot
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'My Time.png'; // Set the filename for the downloaded image
    link.click();
  });
});

/* Age till 100 */
document.getElementById('birthdateForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const birthdateInput = document.getElementById('birthdateInput').value;

  // Check if the entered date is in the correct format (DD/MM/YYYY)
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!datePattern.test(birthdateInput)) {
    alert('Please enter a valid date in DD/MM/YYYY format.');
    return;
  }

  const [day, month, year] = birthdateInput.split('/');
  const formattedDate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD

  const birthDate = new Date(year, month - 1, day);
  const currentDate = new Date();

  // Calculate the remaining time to reach 100 years from the birth date
  const targetDate = new Date(birthDate.getFullYear() + 100, birthDate.getMonth(), birthDate.getDate());

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
  const interval = setInterval(updateCountdown, 1000);
});

/* Input focus */
function setFocus() {
  document.getElementById('birthdateInput').focus();
}

window.addEventListener('load', setFocus);

// Assuming the div where you want to display the age has the ID 'yourage'
/* const yourage = document.getElementById('yourage');

document.getElementById('birthdateForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const birthdateInput = document.getElementById('birthdateInput').value;
  const [day, month, year] = birthdateInput.split('/');
  const birthDate = new Date(year, month - 1, day);
  const currentDate = new Date();

  // Calculate the age
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthsDiff = currentDate.getMonth() - birthDate.getMonth();

  if (monthsDiff < 0 || (monthsDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  console.log('Calculated Age:', age); // This shows the calculated age in the console
  
  // Update the content of the 'yourage' div with the calculated age
  yourage.textContent = `${age} Years Old Right Now`;
});
 */