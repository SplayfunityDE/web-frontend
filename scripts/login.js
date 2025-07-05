var user = true;
var pw = true;

async function handleLogin(event) {
    const buttonSpinner = document.querySelector(".loader");
    const buttonText = document.querySelector(".btntext");
    buttonSpinner.style.opacity = "1";
    buttonText.style.opacity = "0";
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fetchCredentials(username, password);
}

async function fetchCredentials(username, value) {
    const buttonSpinner = document.querySelector(".loader");
    const buttonText = document.querySelector(".btntext");
    const errorField = document.querySelector(".error");
    try {
        const response = (await fetch("https://api.splayfer.de/authentication/accounts/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                value: value,
            })
        }));
        if (await response.text() == "true") {
            //Weiterleitung
            window.location.href = "/sites/ticket/dashboard.html";
        } else {
            const fields = document.querySelectorAll(".input-field input");
            console.log(fields);
            fields.forEach(field => {
                field.style.border = "2px solid rgb(209, 71, 63, .5)";
            });
            buttonSpinner.style.opacity = "0";
            buttonText.style.opacity = "1";
            errorField.innerHTML = "Ungültige Anmeldeinformationen"
            user = false;
            pw = false;
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const errorField = document.querySelector(".error");
    const usernameInput = document.querySelector("#username");
    usernameInput.addEventListener("input", function (event) {
        usernameInput.style.border = "2px solid rgba(255, 255, 255, .2)";
        if (pw == true) {
            errorField.innerHTML = "";
        } else {
            user = true;
        }
    });
    const passwordInput = document.querySelector("#password");
    passwordInput.addEventListener("input", function (event) {
        passwordInput.style.border = "2px solid rgba(255, 255, 255, .2)";
        if (user == true) {
            errorField.innerHTML = "";
        } else {
            pw = true;
        }
    });
});