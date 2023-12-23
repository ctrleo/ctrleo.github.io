var backend = "https://mastodon-tender-leopard.ngrok-free.app";
var queries = window.location.search;
var params = new URLSearchParams(queries);

async function get_token(URL) {
    var token = await fetch(URL);
    return token;
};

if (params.has('code') && params.has('state')) {
    spotify_token = get_token(backend + '/callback' + '?code=' + params.get('code') + '&state=' + params.get('state'));
    console.log(spotify_token.constructor.name);
};
