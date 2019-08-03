<template>
    <div class="spotify-search-wrapper text-white">
        <div class="div p-2">
            <h1>Search</h1>
            <input type="text"
                   v-model="query"
                   placeholder="Search"
                   class="block w-9/12 rounded border-0 m-4 p-3 text-black"/>
        </div>
        <div class="p-2">
            <div>Type</div>
            <select v-model="type" required class="block w-9/12 rounded border-0 m-4 h-12 text-black">
                <option value=""></option>
                <option value="track">Track</option>
            </select>
        </div>
        <div class="p-2 mb-10">
            <button @click="searchSpotify"
                    :disabled="! readyToSearch"
                    :class="{'bg-gray-300 text-gray-600': ! readyToSearch, 'bg-gray-800 text-white': readyToSearch}"
                    class="p-4 ml-1 mt-4 rounded"
                    type="button">
                <i class="fa fa-spin fa-spinner" v-if="searching"></i>
                <i class="fa fa-search" v-if="! searching"></i> Search
            </button>
        </div>
        <div class="p-3 text-white bg-gray-800" v-if="results.length">
            <p class="mb-10">Showing <strong>{{ results.length }}</strong> results</p>

            <ul>
                <li v-for="(track, index) in matches" :key="index" class="py-3 border-b-2 flex">
                    <div class="pr-4">
                        <img :src="track.image" :alt="track.title" width="100" />
                    </div>
                    <div class="flex-1">
                        <p class="text-xl"><strong>{{ track.title }}</strong></p>
                        <p class="text-gray-400" v-for="(artist, index) in track.artists" :key="index">{{ artist }}</p>
                        <p class="text-gray-600 text-sm uppercase mt-2">{{ track.album }}</p>
                    </div>
                    <div>
                        <button @click="$emit('track-selected', `spotify:track:${track.id}`)"
                                class="border-2 p-4 rounded-full mt-2">
                            <i class="fa fa-play"></i> Play
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "SpotifySearch",
        props: {
            token: {
                required: true
            }
        },
        data() {
            return {
                searching: false,
                query: '',
                type: 'track',
                results: []
            }
        },
        methods: {
            searchSpotify() {
                this.searching = true

                axios.get(`https://api.spotify.com/v1/search?q=${this.query}&type=${this.type}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                })
                .then(response => {
                    this.searching = false

                    this.results = response.data.tracks.items
                })
            }
        },
        computed: {
            readyToSearch() {
                return !! (this.query.length && this.type && this.type.length)
            },
            matches() {
                return this.results
                        .map(result => {
                            return {
                                id: result.id,
                                title: result.name,
                                href: result.href,
                                artists: result.artists.map(artist => artist.name),
                                image: result.album.images[0].url,
                                album: result.album.name,
                            }
                        })
            }
        }
    };
</script>
