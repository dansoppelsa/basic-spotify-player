<template>
    <div class="spotify-track-poster">
        <div class="text-white uppercase font-thin text-center font-thin">Playing From Album</div>
        <div class="text-white text-center font-bold mb-4">{{ track.album.name }}</div>
        <div><img :src="currentImage" :alt="track.name"></div>
        <div class="text-2xl font-medium text-white mt-3"><span>{{ track.name }}</span></div>
        <div class="font-hairline text-gray-300"><p v-for="(artist, key) in currentArtists" :key="key">{{ artist }}</p></div>
    </div>
</template>

<script>
    export default {
        name: "SpotifyTrackPoster",
        props: {
            track: {
                type: Object,
                required: true
            }
        },
        computed: {
            currentArtists() {
                return this.track
                    .artists
                    .map(artist => artist.name)
            },
            currentImage() {
                return this.track.album.images[2].url
            },
        },
    };
</script>
