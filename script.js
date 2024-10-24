const clientId = 'f3b866d72de445f7bc49f6dac6e9d1eb'; // Replace with your actual Spotify client ID
const redirectUri = 'https://t1devzeus.github.io/moodtunes/callback'; // Your GitHub Pages callback URL
const authEndpoint = 'https://accounts.spotify.com/authorize';
const scopes = ['playlist-modify-public', 'user-read-private'];

// Spotify login function
function loginToSpotify() {
    // Redirect to Spotify login page
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Extract the access token from the URL hash after Spotify login
const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce((acc, curr) => {
        const [key, value] = curr.split('=');
        acc[key] = value;
        return acc;
    }, {});

window.location.hash = ''; // Clear the token from the URL
const accessToken = hash.access_token; // Store the access token
console.log('Access Token:', accessToken); // Log to verify it's captured correctly

// Handle mood button clicks
const moodButtons = document.querySelectorAll('.mood');
moodButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const mood = event.target.dataset.mood;
        console.log('Selected mood:', mood); // Log the selected mood for debugging
        getPlaylistByMood(mood); // Fetch playlist based on mood
    });
});

// Function to fetch a playlist based on mood
async function getPlaylistByMood(mood) {
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
