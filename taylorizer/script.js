var callback = "http://mastodon-tender-leopard.ngrok-free.app/callback";
var queries = window.location.search;
var params = new URLSearchParams(queries);
if (params.has('code') && params.has('state') {
    spotify_token = await fetch(callback + '?code=' params.get('code') + '&state=' + params.get('state');
};