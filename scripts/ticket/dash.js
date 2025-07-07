document.addEventListener("DOMContentLoaded", () => {
    const tableHtml = "";
    const table = document.querySelector("table");
    fetch("https://api.splayfer.de/ticket/list/all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
    })
    .then(res => {
        console.log(res);
    })
});