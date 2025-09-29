var token = localStorage.getItem("jwt") ? localStorage.getItem("jwt") : sessionStorage.getItem("jwt");
const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelectorAll(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text"),
    logoutLoader = body.querySelector(".loader");
//layout
const maxMobileWidth = 768;
    
toggle.forEach(element => {
   element.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    }); 
});

if (innerWidth <= maxMobileWidth) {
    sidebar.classList.toggle("close");
}

if (localStorage.getItem("darkmode") == "true") {
    body.classList.toggle("dark");
}

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");
    const iframe = document.getElementById("contentFrame");
    if (body.classList.contains("dark")) {
        modeText.innerHTML = "Light Mode";
        iframe.contentWindow.postMessage({ dark: true }, "*");
        localStorage.setItem("darkmode", true);
    } else {
        modeText.innerHTML = "Dark Mode";
        iframe.contentWindow.postMessage({ dark: false }, "*");
        localStorage.setItem("darkmode", false);
    }
});


const navLinks = document.querySelectorAll(".nav-link");
const homeSection = document.querySelector(".home");
const iframe = document.querySelector("#contentFrame");

navLinks.forEach(link => {
    link.addEventListener("click", async () => {
        const page = link.getAttribute("data-page");
        try {
            const response = await fetch(`/sites/ticket/${page}.html`);
            RememberPage.load(page + ".html");
            window.location.hash = page;
            //iframe.src = "/sites/ticket/" + page + ".html";
            if (innerWidth <= maxMobileWidth) { //close sidebar after click on mobile view
                sidebar.classList.toggle("close");
            }
        } catch (err) {
            homeSection.innerHTML = "<div class='text'>Fehler beim Laden der Seite.</div>";
            console.error("Ladefehler:", err);
        }
    });
});

const logoutLink = document.querySelector(".nav-bottom-link");

logoutLink.addEventListener("click", async () => {
    logoutLoader.style.opacity = "1";
    body.querySelector(".nav-bottom-link i").style.opacity = "0";
    body.querySelector(".nav-bottom-link span").style.opacity = "0";
    localStorage.getItem("jwt") ? localStorage.removeItem("jwt") : sessionStorage.removeItem("jwt");
        try {
        const res = await fetch("https://api.splayfer.de/authentication/accounts/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        window.location.href = '/sites/login.html';
        console.log("ok");
    } catch (error) {
        window.top.location.href = '/sites/login.html';
    }
});

document.addEventListener("DOMContentLoaded", () => {

    if (!(localStorage.getItem('jwt') || sessionStorage.getItem('jwt'))) {
        window.location.href = '/sites/login.html';
    }
});