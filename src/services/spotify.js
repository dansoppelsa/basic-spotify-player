/* global Spotify */

import axios from 'axios'

const spotifyApiUrl = `https://api.spotify.com/v1`

export const shuffle = (deviceId, state, token) => (
    axios.put(`${spotifyApiUrl}/me/player/shuffle?device_id=${deviceId}&state=${state}`, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
)

export const playTrack = (deviceId, track, token) => (
    axios.put(`${spotifyApiUrl}/me/player/play?device_id=${deviceId}`,
        JSON.stringify({uris: [track]}),
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }
    )
)


// ---

export const createPlayer = (name, token) => {
    return new Spotify.Player({
        name,
        getOAuthToken: cb => cb(token)
    })
}
