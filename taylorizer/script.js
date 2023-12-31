var backend = "https://138.68.116.108";
var params = new URLSearchParams(window.location.search);
var origin = window.location.origin + "/taylorizer";
var auth_token = sessionStorage.getItem("access_token");
var stolen = ["Fearless (International Version)", "Fearless (Platinum Edition)", "Speak Now (Deluxe Package)", "Speak Now", "Speak Now (Deluxe Package)", "Red (Deluxe Edition)", "1989", "1989 (Deluxe)"];

async function main() {
    var select = document.getElementById('playlists_dropdown');
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
            .finally(function() {
                sessionStorage.setItem("access_token", token);
                window.location.replace(origin);
            });
    };
    if (auth_token !== null) {
        document.getElementById("sign-in").style.display = "none";
        var getplaylists = await fetch("https://api.spotify.com/v1/me/playlists", {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + auth_token
            }
        });
        var playlists = (await getplaylists.json()).items;
        for (let i = 0; i < playlists.length; i++) {
            let playlist_name = playlists[i].name;
            let playlist_id = playlists[i].id;
            let option = new Option(playlist_name, playlist_id);
            select.add(option);
        };
        select.style.display = "inline-block";
    };
};

async function getplaylist() {
    var select = document.getElementById('playlists_dropdown');
    var id = select.value;
    let playlist_tracks = await fetch("https://api.spotify.com/v1/playlists/" + id + "/tracks", {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + auth_token
        }
    });
    let jsontracks = await playlist_tracks.json();
    var tracks = jsontracks.items;
    for (let t = 0; t < tracks.length; t++) {
        let track = tracks[t].track;
        console.log(track.name);
        let taylors = track.name + " (Taylor\'s Version)";
        if (stolen.includes(track.album.name)) {
            let spotifysearch = encodeURI("track:" + taylors + " artist:Taylor Swift");
            let searching = await fetch("https://api.spotify.com/v1/search?q=" + spotifysearch + "&type=track&limit=1", {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + auth_token
                }
            });
            let parsed_search = await searching.json();
            let parsed_track = parsed_search.tracks.items[0];
            if (parsed_track.name == taylors) {
                console.log(taylors + " found!");
            } else {
                console.log("Taylor\'s Version not found for " + track.name);
            }
        };
    };
};