const clientId = 'f3b866d72de445f7bc49f6dac6e9d1eb';
const redirectUri = 'http://localhost:5500/callback'; // Match this to what you set in the developer dashboard
const authEndpoint = 'https://accounts.spotify.com/authorize';
const scopes = ['playlist-modify-public', 'user-read-private'];

function loginToSpotify() {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Call this function when the user selects a mood, to log them in
