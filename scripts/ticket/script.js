const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});

if (sessionStorage.getItem("darkmode") == "true") {
    body.classList.toggle("dark");
}

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");
    const iframe = document.getElementById("contentFrame");
    if (body.classList.contains("dark")) {
        modeText.innerHTML = "Light Mode";
        iframe.contentWindow.postMessage({ dark: true }, "*");
        sessionStorage.setItem("darkmode", true);
    } else {
        modeText.innerHTML = "Dark Mode";
        iframe.contentWindow.postMessage({ dark: false }, "*");
        sessionStorage.setItem("darkmode", false);
    }
});

const navLinks = document.querySelectorAll(".nav-link");
const homeSection = document.querySelector(".home");

navLinks.forEach(link => {
    link.addEventListener("click", async () => {
        const page = link.getAttribute("data-page");
        try {
            const response = await fetch(`/sites/ticket/${page}.html`);
            homeSection.innerHTML = "<iframe id=\"contentFrame\" src=\" /sites/ticket/" + page + ".html\" width=\"100 % \" height=\"100 % \" style=\"border: none;\"></iframe>"
        } catch (err) {
            homeSection.innerHTML = "<div class='text'>Fehler beim Laden der Seite.</div>";
            console.error("Ladefehler:", err);
        }
    });
});

const logoutLink = document.querySelector(".nav-bottom-link");

logoutLink.addEventListener("click", async () => {
    localStorage.removeItem("jwt");
    window.location.href = '/sites/login.html';
});

document.addEventListener("DOMContentLoaded", () => {

    if (!(localStorage.getItem('jwt') || sessionStorage.getItem('jwt'))) {
        window.location.href = '/sites/login.html';
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const homeSection = document.querySelector(".home");

    fetch("/sites/ticket/dash.html")
        .then(response => {
            if (!response.ok) throw new Error("Datei konnte nicht geladen werden.");
            return response.text();
        })
        .then(html => {
            homeSection.innerHTML = "<iframe id=\"contentFrame\" src=\" /sites/ticket/dash.html\" width=\"100 % \" height=\"100 % \" style=\"border: none;\"></iframe>"
        })
        .catch(error => {
            console.error("Fehler beim Laden:", error);
            homeSection.innerHTML = "<p>Fehler beim Laden der Startseite.</p>";
        });
});