var backend = "https://138.68.116.108";
var params = new URLSearchParams(window.location.search);
var origin = window.location.origin + "/taylorizer";
var auth_token = sessionStorage.getItem("access_token");
var playlists;

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
        playlists = (await getplaylists.json()).items;
        for (let i = 0; i < playlists.length; i++) {
            let playlist_name = playlists[i].name;
            let option = new Option(playlist_name, playlist_name);
            select.add(option);
        };
        select.style.display = "inline-block";
    };
};

async function getplaylist() {
    let select = document.getElementById('playlists_dropdown');
    var title = select.value;
    for (let i = 0; i < playlists.length; i++) {
        let playlist_name = playlists[i].name;
        if (playlist_name === title) {
            var id = playlists[i].id;
            var target = await fetch("https://api.spotify.com/v1/playlists/" + id, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + auth_token
                }
            })
            var playlist = await target.json();
            break
        } else {
            // idk continue
        };
    };
    var tracks = playlist.tracks.items;
    for (let t = 0; t < tracks.length; t++) {
        let song = tracks[t].track;
        let release = new Date(song.album.release_date);
        if (song.artists[0].name === "Taylor Swift") {
            if (release < new Date(2019)) {
                let song_title = song.name;
                let taylors = song.name + " (Taylor's Version)";
            } else {
                break
            }
        } else {
            break
        }
    }

};
