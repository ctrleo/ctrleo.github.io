var backend = "http://mastodon-tender-leopard.ngrok-free.app";
var queries = window.location.search;
var params = new URLSearchParams(queries);

//ngrok bypass
fetch(backend, {
    method: 'POST',
    headers: {
        'content-type': 'text/plain',
        'ngrok-skip-browser-warning': true
    }
})

if (params.has('code') && params.has('state')) {
    spotify_token = await fetch(backend + '/callback' + '?code=' + params.get('code') + '&state=' + params.get('state'))
    if (spotify_token.status === 200) {
        console.log("success");
        // will come back to this later
    } else {
        console.log("auth error");
        // will also come back to this later
    };
};
