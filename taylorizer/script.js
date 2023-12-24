var backend = "http://127.0.0.1:3000";
var params = new URLSearchParams(window.location.search);


if (params.has("code")) {
    fetch(backend + "/callback?code=" + params.get("code"))
    .then(function(rsp) {if (rsp.ok) {
        spotify_tokens = rsp.json()
        .then(function() {window.localStorage.setItem("auth_token", JSON.stringify(spotify_tokens))})
    }})
};