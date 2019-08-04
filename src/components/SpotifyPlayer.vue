<template>
    <div class="p-8 mx-auto">
        <div class="flex">
            <div class="w-1/3">
                <spotify-search :token="token.token" @track-selected="playTrack" />
            </div>
            <div class="w-2/3">
                <spotify-track-poster :track="current_track" v-if="current_track" class="max-w-md mx-auto" />
                <progress-bar :total="currentState.duration" :complete="currentState.position" v-if="currentState" class="max-w-md mx-auto my-5" />
                <div class="controls max-w-md mx-auto flex justify-center mt-10">
                    <div class="flex-1">
                        <button @click="shuffle()"
                                :class="{'text-green-500': currentState && currentState.shuffle}"
                                class="text-white rounded-full h-12 w-12 flex items-center justify-center flex-col outline-none">
                            <div>
                                <i class="fa fa-random fa-2x"></i>
                            </div>
                            <div class="w-2 h-2 rounded-full" :class="{'bg-green-500': currentState && currentState.shuffle}"></div>
                        </button>
                    </div>
                    <div class="flex-1">
                        <button @click="previousTrack()" class="text-white rounded-full h-12 w-12 flex items-center justify-center outline-none">
                            <i class="fa fa-step-backward fa-2x"></i>
                        </button>
                    </div>
                    <div class="flex-1 flex justify-center">
                        <button @click="playPause" class="bg-white text-black rounded-full h-12 w-12 flex items-center justify-center outline-none">
                            <i class="fa" :class="{'fa-play': ! this.currentState || this.currentState.paused, 'fa-pause': this.currentState && ! this.currentState.paused}"></i>
                        </button>
                    </div>
                    <div class="flex-1 flex justify-end">
                        <button @click="nextTrack()" class="text-white rounded-full h-12 w-12 flex items-center justify-center outline-none">
                            <i class="fa fa-step-forward fa-2x"></i>
                        </button>
                    </div>
                    <div class="flex-1 flex justify-end">
                        <button @click="repeat()" class="text-white rounded-full h-12 w-12 flex items-center justify-center outline-none">
                            <i class="fa fa-retweet fa-2x"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import ProgressBar from './ProgressBar.vue'
    import SpotifyTrackPoster from './SpotifyTrackPoster.vue'
    import SpotifySearch from './SpotifySearch.vue'
    import * as SpotifyService from '../services/spotify'

    export default {
        name: "SpotifyPlayer",
        components: {
            ProgressBar,
            SpotifyTrackPoster,
            SpotifySearch
        },
        props:{
            token: {
                type: Object,
                required: true
            },
            trackId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                player: null,
                current_track: null,
                currentState: null,
                ready: false,
                intervalNumber: null
            }
        },
        methods: {
            playTrack(track) {
                const deviceId = this.player._options.id

                SpotifyService.playTrack(deviceId, track, this.token.token)
                    .catch(console.error) // eslint-disable-line no-console
            },
            createPlayer() {
                window.console.log('creating player...')

                this.player = SpotifyService.createPlayer(
                    'My Spotify Player',
                    this.token.token,
                )

                this.player.on('ready', ({device_id}) => {
                    this.ready = true
                    this.startPlaying()
                    window.console.log('Ready with Device ID', device_id);
                });

                this.player.on('not_ready', ({device_id}) => {
                    this.ready = false
                    window.console.log('Not Ready with Device ID', device_id);
                });

                this.player.on('player_state_changed', (params) => {
                    this.current_track = params.track_window.current_track
                    window.console.log('player state changed', params)
                });

                this.player.on('authentication_error', (err) => {
                    window.console.log('auth error', err)
                });

                this.player.on('initialization_error', (params) => {
                    window.console.error('Failed to initialize', params);
                });

                this.player.on('playback_error', ({ error }) => {
                    window.console.error(error);
                });

                this.player.connect()

                setInterval(() => {
                    this.getCurrentState()
                }, 100)
            },
            startPlaying() {
                this.playTrack(`spotify:track:${this.trackId}`)
            },
            playPause() {
                this.player.togglePlay()
            },
            async getCurrentState() {
                const state = await this.player.getCurrentState()

                if (! state) {
                    return
                }

                this.currentState = state
            },
            previousTrack() {
                this.player.previousTrack()
            },
            nextTrack() {
                this.player.nextTrack()
            },
            shuffle() {
                const deviceId = this.player._options.id
                let state = this.currentState && this.currentState.shuffle ? 'false' : 'true'

                SpotifyService.shuffle(deviceId, state, this.token.token)
                    .catch(console.error) // eslint-disable-line no-console
            }
        },
        mounted() {
            window.onSpotifyWebPlaybackSDKReady = () => {
                this.createPlayer()
            }
        },
    };
</script>
