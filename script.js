// Spotify API Credentials
const clientId = 'YOUR_CLIENT_ID'; // Replace with your actual Spotify Client ID
const redirectUri = 'https://t1devzeus.github.io/moodtunes/callback'; // Your GitHub Pages callback URL
const authEndpoint = 'https://accounts.spotify.com/authorize';
const scopes = ['playlist-modify-public', 'user-read-private'];

// Function to redirect user to Spotify login
function loginToSpotify() {
    const authorizationUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&response_type=token&show_dialog=true`;
    window.location = authorizationUrl; // Redirect to Spotify
}

// Function to extract the access token from the URL hash
function getAccessTokenFromUrl() {
    const hash = window.location.hash; // Get the URL hash
    const tokenData = hash.substring(1).split('&').reduce((acc, curr) => {
        const [key, value] = curr.split('=');
        acc[key] = decodeURIComponent(value); // Decode the token
        return acc;
    }, {});

    return tokenData.access_token; // Get the access token
}

// Check for access token on page load
window.onload = () => {
    const accessToken = getAccessTokenFromUrl(); // Get the token
    console.log('Access Token:', accessToken); // Log it for verification

    // If accessToken exists, you can now use it to make API calls
    if (accessToken) {
        setupMoodButtons(accessToken); // Call function to set up mood buttons with access token
    } else {
        // If no access token, prompt user to log in
        loginToSpotify();
    }
};

// Function to set up mood buttons
function setupMoodButtons(accessToken) {
    const moodButtons = document.querySelectorAll('.mood');

    moodButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const mood = event.target.dataset.mood;
            console.log('Selected mood:', mood); // Log the selected mood for debugging
            getPlaylistByMood(mood, accessToken); // Fetch playlist based on mood
        });
    });
}

// Function to fetch a playlist based on mood
async function getPlaylistByMood(mood, accessToken) {
    console.log('Fetching playlist for mood:', mood); // Log to track the function call

    try {
        // Make the API call to Spotify's search endpoint
        const response = await fetch(`https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=1`, {
            headers: {
                'Authorization': `Bearer ${accessToken}` // Add the access token to the request
            }
        });

        // Check if the API request was successful
        if (!response.ok) {
            throw new Error('API Request Failed. Status: ' + response.status); // Log failure status
        }

        const data = await response.json(); // Parse the JSON response
        console.log('API Response:', data); // Log the full response for debugging

        // Ensure there is playlist data and display it
        if (data.playlists && data.playlists.items && data.playlists.items.length > 0) {
            displayPlaylist(data.playlists.items[0]);
        } else {
            console.log('No playlists found for this mood.');
            displayErrorMessage('No playlists found for this mood. Please try another mood.');
        }
    } catch (error) {
        console.error('Error fetching playlist:', error); // Log errors if any
        displayErrorMessage('Failed to fetch playlist. Please try again later.');
    }
}

// Function to display the playlist in the UI
function displayPlaylist(playlist) {
    console.log('Displaying playlist:', playlist); // Log the playlist data

    const playlistDiv = document.getElementById('playlist');
    playlistDiv.innerHTML = `
        <h2>Here's your ${playlist.name} playlist:</h2>
        <iframe src="https://open.spotify.com/embed/playlist/${playlist.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    `;
}

// Function to display error messages in the UI
function displayErrorMessage(message) {
    const playlistDiv = document.getElementById('playlist');
    playlistDiv.innerHTML = `<p>${message}</p>`; // Display the error message
}
