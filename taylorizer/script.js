var callback = new URL("http://127.0.0.1", '/callback');
callback.port = 8000;
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
if (urlParams.has('code') && urlParams.has('state')) {
    var keys = await fetch(callback, {
        code: urlParams.get('code'),
        state: urlParams.get('state')
    })
};