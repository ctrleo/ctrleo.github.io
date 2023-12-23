var backend = "https://mastodon-tender-leopard.ngrok-free.app";
var queries = window.location.search;
var params = new URLSearchParams(queries);

async function get_token(URL) {
    var token = await fetch(URL);
    return token.json();
};

if (params.has('code') && params.has('state')) {
    spotify_token = get_token(backend + '/callback' + '?code=' + params.get('code') + '&state=' + params.get('state'))
    // get rid of this console.log in production model pls
    console.log(JSON.stringify(spotify_token))
    if (spotify_token.status === 200) {
        console.log("success");
        // will come back to this later
    } else {
        console.log("auth error");
        // will also come back to this later
    };
};
