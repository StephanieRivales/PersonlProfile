function hireMe() {
  alert("Thank you for considering me! I look forward to connecting.");
}

function toggleCertificates() {
  const certs = document.getElementById("certificates");
  certs.classList.toggle("hidden");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function downloadResume() {
  const link = document.createElement("a");
  link.href = "Stephanie_Rivales_Resume.pdf"; // replace with your actual resume file
  link.download = "Stephanie_Rivales_Resume.pdf";
  link.click();
}

// Handle message form submission
document.getElementById("messageForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  fetch("http://localhost:3000/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.msg);
    document.getElementById("messageForm").reset();
  })
  .catch(err => alert("Error sending message: " + err));
});
