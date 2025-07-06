const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        modeText.innerHTML = "Light Mode"
    } else {
        modeText.innerHTML = "Dark Mode"
    }
});

const navLinks = document.querySelectorAll(".nav-link");
const homeSection = document.querySelector(".home");

navLinks.forEach(link => {
    link.addEventListener("click", async () => {
        const page = link.getAttribute("data-page");
        try {
            const response = await fetch(`/sites/ticket/${page}.html`);
            homeSection.innerHTML = "<iframe src=\" /sites/ticket/" + page + ".html\" width=\"100 % \" height=\"100 % \" style=\"border: none;\"></iframe>"
        } catch (err) {
            homeSection.innerHTML = "<div class='text'>Fehler beim Laden der Seite.</div>";
            console.error("Ladefehler:", err);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem('jwt');
    if (!token) {
        window.location.href = '/sites/ticket/login.html';
    } else {
        // Optional: Token-Inhalt anzeigen
        const user = parseJwt(token).sub;
        document.getElementById('username').textContent = user;
    }

    const homeSection = document.querySelector(".home");

    fetch("/sites/ticket/dash.html")
        .then(response => {
            if (!response.ok) throw new Error("Datei konnte nicht geladen werden.");
            return response.text();
        })
        .then(html => {
            homeSection.innerHTML = "<iframe src=\" /sites/ticket/dash.html\" width=\"100 % \" height=\"100 % \" style=\"border: none;\"></iframe>"
        })
        .catch(error => {
            console.error("Fehler beim Laden:", error);
            homeSection.innerHTML = "<p>Fehler beim Laden der Startseite.</p>";
        });
});