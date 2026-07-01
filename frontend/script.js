const API = "http://localhost:3000";

// ==============================
// HIRE ME
// ==============================

function hireMe() {
    window.location.href =
        "mailto:yurianeyuuu@gmail.com?subject=Job Opportunity";
}

// ==============================
// DARK MODE
// ==============================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");

    } else {

        localStorage.setItem("theme", "light");

    }

}

// Load saved theme
window.addEventListener("load", () => {

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark-mode");

    }

    loadMessages();

});

// ==============================
// SEND MESSAGE
// ==============================

const messageForm = document.getElementById("messageForm");

if (messageForm) {

    messageForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            showAlert("Please complete all fields.", "error");
            return;
        }

        try {
            const response = await fetch(`${API}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            showAlert(data.msg, data.success ? "success" : "error");

            if (data.success) {
                messageForm.reset();
                loadMessages();
            }

        } catch (error) {
            console.error(error);
            showAlert("Unable to connect to the server.", "error");
        }

    });

}

// ==============================
// CUSTOM ALERT
// ==============================

function showAlert(message, type = "success") {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");

  alertMessage.textContent = message;
  alertBox.className = `alert ${type}`;
  alertBox.classList.remove("hidden");

  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 3000);
}

function closeAlert() {
  document.getElementById("customAlert").classList.add("hidden");
}

// ==============================
// CUSTOM CONFIRM MODAL
// ==============================

function showConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.getElementById("confirmModal");
    const text = document.getElementById("confirmText");
    const okBtn = document.getElementById("confirmOk");
    const cancelBtn = document.getElementById("confirmCancel");

    text.textContent = message;
    overlay.classList.remove("hidden");

    function cleanup(result) {
      overlay.classList.add("hidden");
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
      resolve(result);
    }

    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }

    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
  });
}

// ==============================
// LOAD MESSAGES
// ==============================

async function loadMessages() {
  try {
    const response = await fetch(`${API}/messages`);
    const messages = await response.json();
    const list = document.getElementById("messageList");
    list.innerHTML = "";

    if (messages.length === 0) {
      list.innerHTML = "<li>No messages yet.</li>";
      return;
    }

    messages.forEach(message => {
      const li = document.createElement("li");
      const date = new Date(message.date);

      li.innerHTML = `
        <strong>👤 ${message.name}</strong>
        <small>${message.email}</small>
        <p>${message.message}</p>
        <small>${date.toLocaleString()}</small>
        <button class="delete-btn" data-id="${message._id}">Delete</button>
      `;

      list.appendChild(li);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        const confirmed = await showConfirm("Are you sure you want to delete this message?");

        if (confirmed) {
          try {
            const res = await fetch(`${API}/messages/${id}`, { method: "DELETE" });
            const data = await res.json();
            showAlert(data.msg, data.success ? "success" : "error");
            loadMessages();
          } catch (err) {
            console.error(err);
            showAlert("Error deleting message.", "error");
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

// ==============================
// ACTIVE NAVIGATION
// ==============================

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

// ==============================
// SMOOTH SCROLL
// ==============================

navLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        target.scrollIntoView({

            behavior: "smooth"

        });

    });

});
