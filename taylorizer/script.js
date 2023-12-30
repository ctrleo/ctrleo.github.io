var backend = "https://138.68.116.108";
var params = new URLSearchParams(window.location.search);
var origin = window.location.origin

function checkparams() {
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
            .finally(function() {localStorage.setItem("access_token", token)});
    };
};