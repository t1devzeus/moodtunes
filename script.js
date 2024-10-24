const clientId = 'f3b866d72de445f7bc49f6dac6e9d1eb';
const redirectUri = 'https://t1devzeus.github.io/moodtunes/callback'; 
const authEndpoint = 'https://accounts.spotify.com/authorize';
const scopes = ['playlist-modify-public', 'user-read-private'];

function loginToSpotify() {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Call this function when the user selects a mood, to log them in

const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce((acc, curr) => {
        const [key, value] = curr.split('=');
        acc[key] = value;
        return acc;
    }, {});

window.location.hash = ''; // Clear the token from the URL
const accessToken = hash.access_token; // Use this token for requests

const moodButtons = document.querySelectorAll('.mood');

moodButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const mood = event.target.dataset.mood;
        getPlaylistByMood(mood);
    });
});

async function getPlaylistByMood(mood) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=1`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    displayPlaylist(data.playlists.items[0]);
}

function displayPlaylist(playlist) {
    const playlistDiv = document.getElementById('playlist');
    playlistDiv.innerHTML = `
        <h2>Here's your ${playlist.name} playlist:</h2>
        <iframe src="https://open.spotify.com/embed/playlist/${playlist.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    `;
}
