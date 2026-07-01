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

            alert("Please complete all fields.");

            return;

        }

        try {

            const response = await fetch(`${API}/contact`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    message
                })

            });

            const data = await response.json();

            const result = document.getElementById("contactResponse");

            result.innerHTML = data.msg;

            result.style.color = data.success ? "green" : "red";

            if (data.success) {

                messageForm.reset();

                loadMessages();

            }

        }

        catch (error) {

            console.error(error);

            alert("Unable to connect to the server.");

        }

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

            list.innerHTML =
                "<li>No messages yet.</li>";

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
            `;

            list.appendChild(li);

        });

    }

    catch (error) {

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

