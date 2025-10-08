var token = null;
let pushMessageFetching = false;

window.Global = {
    
    getJwtToken: async function () {
        return localStorage.getItem("jwt") ? localStorage.getItem("jwt") : sessionStorage.getItem("jwt");
    },

    restRequest: async function (url, method, body) {
        jwtToken = await this.getJwtToken();
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
                if (response.status === 403)
                  window.top.location.href = '/sites/login.html';
                return false;
            }

            const text = await response.text();
            return text ? JSON.parse(text) : null;

        } catch (error) {
            console.error("Fetch Fehler: ", error);
            return false;
        }    
    },

    loginRequest: async function (username, password, remember) {
        const response = await this.restRequest("https://api.splayfer.de/authentication/accounts/login?remember=" + remember, "POST", {
            "username": username,
            "value": password
        });
        if(response !== false) {
            const storage = remember == true ? localStorage : sessionStorage;
            storage.setItem("jwt", response.token);
        }
        return response;
    },

    logoutRequest: async function () {
        jwtToken = await this.getJwtToken();
        const response = await this.restRequest("https://api.splayfer.de/authentication/accounts/logout", "GET", jwtToken, null);
        localStorage.getItem("jwt") ? localStorage.removeItem("jwt") : sessionStorage.removeItem("jwt");
        return response;
    }
},

window.RememberPage = {
  iframe: null,

  init() {
    this.iframe = document.querySelector("#contentFrame");
    this.handleHashChange();
    window.addEventListener("hashchange", () => this.handleHashChange());
  },

  load(file) {
    if (this.iframe) {
      this.iframe.src = file;
    }
  },

  handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      this.load("/sites/ticket/" + hash + ".html");
    }
  }
},

window.PushMessage = {
    push(message, type) {
      var doc = window.parent.document;
      pushMessageFetching = true;

      doc.querySelector("#push_icons_" + type).style.opacity = "1";

      doc.querySelector(".message").innerHTML = message;
      doc.querySelector(".push_message").style.opacity = "1";
      doc.querySelector(".push_message").style.bottom = "70px";

      setTimeout(() => {
      doc.querySelector(".push_message").style.opacity = "0";
      doc.querySelector(".push_message").style.bottom = "-70px";
      doc.querySelector("#push_icons_" + type).style.opacity = "0";
      pushMessageFetching = false;
      }, 5000);
    }
};
