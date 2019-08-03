<template>
    <div class="progress-bar">
        <div class="bg-gray-600 h-1">
            <div class="bg-white h-1 relative" :style="`width: ${completedPercentage}%;`">
                <div class="absolute block w-3 h-3 bg-white rounded-full right-0 top-0 -mr-2 -mt-1"></div>
            </div>
        </div>
        <div class="flex text-white font-thin mt-1">
            <div class="flex-1">
                {{ completedInMinutes }}
            </div>
            <div class="flex-1 text-right">
                {{ totalInMinutes }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ProgressBar",
        props: {
            complete: {
                type: Number,
                default: 0
            },
            total: {
                type: Number,
                required: true
            },
        },
        methods: {
            minutesAndSeconds(milliseconds) {
                let totalSeconds = Math.floor(milliseconds / 1000)
                let minutes = Math.floor(totalSeconds / 60)
                let seconds = totalSeconds % 60

                if (seconds < 10) {
                    seconds = `0${seconds}`
                }

                return `${minutes}:${seconds}`
            }
        },
        computed: {
            completedPercentage() {
                return ((this.complete / this.total) * 100).toFixed(1)
            },
            completedInMinutes() {
                return this.minutesAndSeconds(this.complete)
            },
            totalInMinutes() {
                return this.minutesAndSeconds(this.total)
            }
        }
    };
</script>
