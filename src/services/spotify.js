/* global Spotify */

import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: {
    'Content-Type': 'application/json',
  }
})

export const shuffle = (device_id, state, token) => (
    api.put('/me/player/shuffle', {}, {
        params: {
            device_id,
            state,
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
)

export const playTrack = (device_id, track, token) => (
    api.put('/me/player/play',
        JSON.stringify({uris: [track]}),
        {
            params: {
                device_id,
            },
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    )
)


export const search = (q, type, token) => (
    api.get('/search',
        {
            params: {
                q,
                type,
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
)

// --- Spotify library class wrappers

export const createPlayer = (name, token) => {
    return new Spotify.Player({
        name,
        getOAuthToken: cb => cb(token)
    })
}
