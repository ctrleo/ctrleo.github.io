var backend = "https://138.68.116.108";
var params = new URLSearchParams(window.location.search);
var origin = window.location.origin + "/taylorizer";
var stolen = ["Fearless (International Version)", "Fearless (Platinum Edition)", "Fearless (Big Machine Radio Release Special)", "Speak Now", "Speak Now (Deluxe Package)", "Speak Now (Big Machine Radio Release Special)", "Today Was A Fairytale", "Red (Deluxe Edition)", "Red (Big Machine Radio Release Special)", "Ronan", "1989", "1989 (Deluxe)", "1989 (Big Machine Radio Release Special)"];
var auth_token = sessionStorage.getItem("access_token");
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
    if (params.has("success")) {
        document.getElementById("caption").style.color = "limegreen";
        document.getElementById("caption").innerText = "DONE!"
    }
    if ((auth_token !== null) && (auth_token !== undefined)) {
        document.getElementById("sign-in").style.display = "none";
        var getplaylists = await fetch("https://api.spotify.com/v1/me/playlists", {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + auth_token
            }
        });
        var playlistsjson = await getplaylists.json();
        var playlists = playlistsjson.items;
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
    document.getElementById("loading").style.display = "block"
    var stolen_songs = [];
    var taylors_versions = [];
    var select = document.getElementById('playlists_dropdown');
    var id = select.value;
    let playlist_tracks = await fetch("https://api.spotify.com/v1/playlists/" + id + "/tracks" + "?limit=50", {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + auth_token
        }
    });
    let jsontracks = await playlist_tracks.json();
    var tracks = jsontracks.items;
    var more = jsontracks.next;
    if (more !== null) {
        document.getElementById("caption").innerText = "(Playlists with over 50 songs may take longer to load)";
        document.getElementById("caption").style.color = "#69FFB4";
    }
    while (more !== null) {
        var moretracks = await fetch(more, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + auth_token
            }
        })
        var newjson = await moretracks.json();
        var moreitems = newjson.items;
        for (let i = 0; i < moreitems.length; i++) {
            tracks.push(moreitems[i]);
        }
        more = newjson.next;
    }
    for (let t = 0; t < tracks.length; t++) {
        let track = tracks[t].track;
        let taylors = track.name + " (Taylor's Version)";
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
            if (parsed_track == undefined) {
                console.log("Taylor's Version not found for " + track.name);
            } else {
                if (parsed_track.name.includes(track.name) || parsed_track.name.includes(taylors)) {
                    stolen_songs.push(track.uri);
                    taylors_versions.push(parsed_track.uri)
                } else {
                    console.log("Taylor's Version not found for " + track.name);
                    console.log("Error: " + parsed_track.name + "does not include " + track.name + " OR " + taylors);
                };
            };
        };
    };
    sessionStorage.setItem("stolen_songs", stolen_songs);
    sessionStorage.setItem("taylors_versions", taylors_versions)
    document.getElementById("loading").style.display = "none";
    document.getElementById("stolen").innerText = stolen_songs.length + " stolen songs found";
    document.getElementById("stolen").style.display = "block";
    if (stolen_songs.length > 0) {
        document.getElementById("taylorize").style.display = "block";
    } else {
        document.getElementById("taylorize").style.display = "none";
    }
};

async function taylorize() {
    let taylors_versions = sessionStorage.getItem("taylors_versions").toString();
    let stolen_songs_str = sessionStorage.getItem("stolen_songs").toString();
    let stolen_songs = stolen_songs_str.split(",");
    let request_obj = {
        "tracks": []
    };
    stolen_songs.forEach(uri => {
        request_obj.tracks.push({ "uri": uri })
    });
    console.log(taylors_versions);
    var id = document.getElementById("playlists_dropdown").value;
    document.getElementById("caption").style.color = "#69FFB4";
    document.getElementById("caption").innerText = "ADDING (Taylor's Versions)...";
    document.getElementById("taylorizing").style.display = "inline-block";
    document.getElementById("playlists_dropdown").style.display = "none";
    document.getElementById("stolen").style.display = "none";
    document.getElementById("taylorize").style.display = "none";
    await fetch("https://api.spotify.com/v1/playlists/" + id + "/tracks?uris=" + taylors_versions, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + auth_token
        }
    });
    document.getElementById("caption").style.color = "red";
    document.getElementById("caption").style.innerText = "REMOVING Stolen Songs...";
    await fetch("https://api.spotify.com/v1/playlists/" + id + "/tracks", {
        method: "DELETE",
        headers: {
            Authorization: 'Bearer ' + auth_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request_obj)
    });
    window.location.replace(origin + "?success=true");
}
