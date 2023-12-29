var backend = "http://127.0.0.1:3000";
var params = new URLSearchParams(window.location.search);

if (params.has("code")) {
    var token;
    fetch(backend + "/callback?code=" + params.get("code"))
        .then(response => response.text())
        .then(text => {token = text})
        .finally(function() {localStorage.setItem("access_token", token)});
};