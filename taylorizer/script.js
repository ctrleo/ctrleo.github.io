var backend = "https://138.68.116.108";
var params = new URLSearchParams(window.location.search);
var origin = window.location.origin + "/taylorizer";
var auth_token = sessionStorage.getItem("access_token");

async function main() {
    if (params.has("auth_error")) {
        document.getElementById("caption").style.color = "red";
        document.getElementById("caption").innerText = "Auth error occured :/ please try again!"
    };
    if (params.has("code")) {
        var token;
        document.getElementById("sign-in").style.display = "none";
        document.getElementById("loading").style.display = "inline-block";
        fetch(backend + "/callback?code=" + params.get("code"))
            .then(response => response.text())
            .then(text => {token = text})
            .catch(function() {window.location.replace(origin + "?auth_error=true")})
            .finally(function() {
                sessionStorage.setItem("access_token", token);
                window.location.replace(origin);
            });
    };
    if (auth_token !== null) {
        console.log("testing access token")
        // throw around awaits and pray
        var me = await fetch("https://api.spotify.com/v1/me", {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + auth_token
            }
        })
        var data = await me.json();
        document.getElementById("caption").innerText = "Hello " + data.display_name;
    };
};
