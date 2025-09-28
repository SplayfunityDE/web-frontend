var token = null;

window.Global = {
    
    getJwtToken: async function () {
        return localStorage.getItem("jwt") ? localStorage.getItem("jwt") : sessionStorage.getItem("jwt");
    },

    restRequest: async function (url, method, jwtToken, body) {
        jwtToken = this.getJwtToken();
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken
                },
                body: body ? JSON.stringify(body) : null
            });

            if(!response.ok) {
                console.error("HTTP Fehler:", response.status);
                return false;
            }

            return response.json();

        } catch (error) {
            console.error("Fetch Fehler: ", error);
            return false;
        }    
    },

    loginRequest: async function (username, password, remember) {
        const response = await this.restRequest("https://api.splayfer.de/authentication/accounts/login?remember=" + remember, "POST", null, {
            "username": username,
            "value": password
        });
        return response;
    },

    logoutRequest: async function () {
        jwtToken = await this.getJwtToken();
        const response = await this.restRequest("https://api.splayfer.de/authentication/accounts/logout", "GET", jwtToken, null);
        return response;
    }

}