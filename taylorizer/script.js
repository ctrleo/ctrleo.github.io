/* todo:
        implement errors
        add key refresh
        add loading animation
*/

var backend = "http://mastodon-tender-leopard.ngrok-free.app";
var queries = window.location.search;
var params = new URLSearchParams(queries);

class spotify_token {
    constructor(access_token, token_type, scope, expires_in, refresh_token) {
        this.access = access_token;
        this.type = token_type;
        this.scope = scope;
        this.expiry = expires_in;
        this.refresh = refresh_token;
    };
};


function getAuthLink() {
    // because ngrok is mean and wants to scare my users away
    login = await fetch(backend + "/login");
    window.open(login, "_self");
};

if (params.has('code') && params.has('state') {
    var tokens = await fetch(callback + '?code=' params.get('code') + '&state=' + params.get('state');
    if (spotify_token.status === 200) {
        var token new spotify_token(tokens.body.access_token, tokens.body.token_type, tokens.body.scope, tokens.body.expires_in, tokens.body.refresh_token);
        console.log("GOT SPOTIFY AUTH TOKEN")
    } else {
        console.log("auth error");
        // alexa remind me to implement errors
    };
};
