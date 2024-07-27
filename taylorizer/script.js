var backend = "https://f9rj8i3m9k.execute-api.eu-west-2.amazonaws.com/default/taylorizer_auth";
var params = new URLSearchParams(window.location.search);
var origin = window.location.origin + "/taylorizer";
var stolen = ["Fearless (International Version)", "Fearless (Platinum Edition)", "Fearless Platinum Edition", "Fearless (Big Machine Radio Release Special)", "Speak Now", "Speak Now (Deluxe Edition)", "Speak Now (Deluxe Package)", "Speak Now (Big Machine Radio Release Special)", "Today Was A Fairytale", "Red (Deluxe Edition)", "Red (Big Machine Radio Release Special)", "Ronan", "1989", "1989 (Deluxe)", "1989 (Deluxe Edition)", "1989 (Big Machine Radio Release Special)"];
var auth_token = localStorage.getItem("access_token");
var redirect_uri = "https://ctrleo.github.io/taylorizer";
var client_id = "d128390f0da0402896d4d02cdfbf2e26";
var scope = "playlist-read-private playlist-modify-private playlist-modify-public"

function getLoginURL() {
    var login_url_params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        redirect_uri: redirect_uri,
        scope: scope
    });
    return "https://accounts.spotify.com/authorize?" + login_url_params.toString();
};

function maketaylors(title) {
    if (title.includes("Voice Memo")) {
        return "SKIP";
    }
    if (title == "Forever & Always - Piano Version") {
        return "Forever & Always (Piano Version) (Taylor's Version)";
    } else if (title == "SuperStar") {
        return "Superstar (Taylor's Version)";
    } else if (title == "I Knew You Were Trouble.") {
        return "I Knew You Were Trouble (Taylor's Version)";
    } else if (title == "Treacherous - Original Demo Recording") {
        return "Treacherous (Taylor's Version)";
    } else if (title == "Red - Original Demo Recording") {
        return "Red (Taylor's Version)";
    } else if (title == "State Of Grace - Acoustic") {
        return "State Of Grace (Acoustic Version) (Taylor's Version)";
    } else if (title == "Mine - POP Mix") {
        return "Mine (Taylor's Version)";
    } else if (title == "Back To December - Acoustic") {
        return "Back To December (Taylor's Version)";
    } else if (title == "Haunted - Acoustic Version") {
        return "Haunted (Taylor's Version)";
    } else {
        return title.replaceAll("’", "'") + " (Taylor's Version)";
    };
};

async function main() {
    document.getElementById("sign-in").href = getLoginURL();
    var select = document.getElementById('playlists_dropdown');
    if (params.has("auth_error")) {
        document.getElementById("caption").style.color = "red";
        document.getElementById("caption").innerText = "Auth error occured :/ please try again!";
        if (localStorage.getItem("access_token")) {
            localStorage.removeItem("access_token");
        }
    };
    if (params.has("playlist_error")) {
        document.getElementById("caption").style.color = "red";
        document.getElementById("caption").innerText = "Error occurred while taylorizing! ERR CODE: " + params.get("playlist_error");
    }
    if (params.has("code")) {
        var token;
        document.getElementById("sign-in").style.display = "none";
        document.getElementById("loading").style.display = "inline-block";
        fetch(backend + "?code=" + params.get("code"))
            .then(response => response.json())
            .then((json) => {token = json.access_token})
            .catch(function() {window.location.replace(origin + "?auth_error=true")})
            .finally(function() {
                localStorage.setItem("access_token", token);
                window.location.replace(origin);
            });
    };
    if (params.has("success")) {
        document.getElementById("caption").style.color = "limegreen";
        document.getElementById("caption").innerText = "DONE!";
    }
    if ((auth_token !== null) && (auth_token !== undefined)) {
        document.getElementById("sign-in").style.display = "none";
        document.getElementById("loading").style.display = "block";
        document.getElementById("sign-out").style.display = "block";
        var getplaylists = await fetch("https://api.spotify.com/v1/me/playlists", {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + auth_token
            }
        });
        if (getplaylists.status !== 200) {
            window.location.replace(origin + "?auth_error=true");
        } else {
            var playlistsjson = await getplaylists.json();
            var playlists = playlistsjson.items;
            for (let i = 0; i < playlists.length; i++) {
                let playlist_name = playlists[i].name;
                let playlist_id = playlists[i].id;
                let option = new Option(playlist_name, playlist_id);
                select.add(option);
            };
            select.style.display = "inline-block";
            document.getElementById("loading").style.display = "none";
        };
    };
};

function logout() {
    localStorage.clear();
    window.location.replace(origin);
}

function set_style(era) {
    document.getElementById("css-style").href = `/taylorizer/eras_css/${era}.css`;
}

async function getplaylist() {
    let stolen_songs = [];
    let taylors_versions = [];
    let used_uris = [];
    let bar = document.getElementById("progress");
    sessionStorage.clear();
    document.getElementById("stolen").style.display = "none";
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
        });
        var newjson = await moretracks.json();
        var moreitems = newjson.items;
        for (let i = 0; i < moreitems.length; i++) {
            tracks.push(moreitems[i]);
        }
        more = newjson.next;
    }
    bar.max = tracks.length;
    bar.style.display = "block";
    for (let t = 0; t < tracks.length; t++) {
        bar.value = t;
        let track = tracks[t].track;
        let taylors = maketaylors(track.name);
        if (taylors == "SKIP") {
            continue;
        }
        if (stolen.includes(track.album.name)) {
            let track_title;
            if (taylors == "Forever & Always (Piano Version) (Taylor's Version)" || taylors == "Forever & Always (Taylor's Version)") {
                track_title = taylors.replace("&", "and");
            } else {
                track_title = taylors;
            }
            let spotifysearch = encodeURI("track:" + track_title + " artist:Taylor Swift");
            let searching = await fetch("https://api.spotify.com/v1/search?q=" + spotifysearch + "&type=track&limit=1", {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + auth_token
                }
            });
            let parsed_search = await searching.json();
            let parsed_track = parsed_search.tracks.items[0];
            if (parsed_track.name.includes(track.name) || parsed_track.name.replaceAll("’", "'") == taylors) {
                stolen_songs.push(track.uri);
                taylors_versions.push(parsed_track.uri);
            } else {
                console.log(`Error: ${taylors} not found, found ${parsed_track.name}`);
            };
        } else if (track.name.replaceAll("’", "'").includes("Taylor's Version")) {
            used_uris.push(track.uri);
        }
    };
    bar.style.display = "none";
    document.getElementById("loading").style.display = "block";
    for (let i = 0; i < taylors_versions.length; i++) {
        if (used_uris.length < 1) { break; };
        let taylors_track = taylors_versions[i];
        if (used_uris.includes(taylors_track)) {
            console.log("DEBUG: Removed duplicate track")
            taylors_versions.splice(i, 1);
        };
    };
    sessionStorage.setItem("stolen_songs", stolen_songs);
    sessionStorage.setItem("taylors_versions", taylors_versions);
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
    let taylors_versions_str = sessionStorage.getItem("taylors_versions").toString();
    let stolen_songs_str = sessionStorage.getItem("stolen_songs").toString();
    let stolen_songs = stolen_songs_str.split(",");
    let taylors_versions = taylors_versions_str.split(",");
    let post_obj = {
        "uris": []
    };
    let delete_obj = {
        "tracks": []
    };
    taylors_versions.forEach(uri => {
        post_obj.uris.push(uri);
    })
    stolen_songs.forEach(uri => {
        delete_obj.tracks.push({ "uri": uri });
    });
    var id = document.getElementById("playlists_dropdown").value;
    document.getElementById("caption").style.color = "#69FFB4";
    document.getElementById("caption").innerText = "ADDING (Taylor's Versions)...";
    document.getElementById("taylorizing").style.display = "inline-block";
    document.getElementById("playlists_dropdown").style.display = "none";
    document.getElementById("stolen").style.display = "none";
    document.getElementById("taylorize").style.display = "none";
    let playlistPost = await fetch("https://api.spotify.com/v1/playlists/" + id + "/tracks", {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + auth_token
        },
        body : JSON.stringify(post_obj)
    });
    if (playlistPost.status == 201 || playlistPost.status == 200) {
        document.getElementById("caption").style.color = "red";
        document.getElementById("caption").style.innerText = "REMOVING Stolen Songs...";
        let playlistDelete = await fetch("https://api.spotify.com/v1/playlists/" + id + "/tracks", {
            method: "DELETE",
            headers: {
                Authorization: 'Bearer ' + auth_token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(delete_obj)
        });
        // nested if statement to also verify playlistDelete
        if (playlistDelete.status == 201 || playlistDelete.status == 200) {
            window.location.replace(origin + "?success=true");
        } else {
            window.location.replace(origin + "?playlist_error=" + playlistPost.status);
        }
    } else {
        window.location.replace(origin + "?playlist_error=" + playlistPost.status);
    }
    window.location.replace(origin + "?success=true");
}
