var backend = "https://mastodon-tender-leopard.ngrok-free.app";
var queries = window.location.search;
var params = new URLSearchParams(queries);
// url = backend + '/callback' + '?code=' + params.get('code') + '&state=' + params.get('state')


if (params.has('code') && params.has('state')) {
    spotify_token = fetch(backend + '/callback' + '?code=' + params.get('code') + '&state=' + params.get('state'));
    // add loading icon here
    console.log("loading");
    spotify_token.then(
        function() {console.log("got token!!!")},
        function() {console.log("got token, error returned :(")}
    )
};
