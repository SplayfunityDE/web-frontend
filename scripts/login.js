async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fetchCredentials(username, password);
}

async function fetchCredentials(username, value) {
    try {
        const response = (await fetch("http://localhost:8080/api/authentication/accounts/hash", {
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
        }
    } catch (error) {
        console.error(error);
    }
}