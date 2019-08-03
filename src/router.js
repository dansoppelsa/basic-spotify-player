import Vue from 'vue'
import Router from 'vue-router'
import SpotifyPlayer from './components/SpotifyPlayer.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: SpotifyPlayer,
      beforeEnter: (to, from, next) => {
        let redirectUri = encodeURI(`${process.env.VUE_APP_PLAYER_URL}/spotify-auth`)
        let scope = ["streaming", "user-read-email", "user-read-private"].join(' ');
        let spotifyUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.VUE_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`
        let token = localStorage.getItem('spotify_token')

        if (! token) {
          window.location.href = spotifyUrl
        }

        token = JSON.parse(token)
        if (Date.now() / 1000 > token.expires) {
          window.location.href = spotifyUrl
        }

        return next()
      },
      props: {
        token: JSON.parse(localStorage.getItem('spotify_token')),
        trackId: '4uLU6hMCjMI75M1A2tKUQC'
      }
    },
    {
      path: '/spotify-auth',
      beforeEnter: () => {
        window.localStorage.setItem('spotify_token', JSON.stringify({
          token: window.location.hash.split('&')[0].substring(2).split('=')[1],
          expires: (new Date).getTime() / 1000 + 3600
        }))

        window.location.href = process.env.VUE_APP_PLAYER_URL
      },
    },
  ]
})
