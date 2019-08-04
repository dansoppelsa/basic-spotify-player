import { shallowMount } from '@vue/test-utils'
import SpotifyPlayer from '@/components/SpotifyPlayer.vue'

import * as SpotifyService from '@/services/spotify';

const shallowMountSpotifyPlayer = (token, deviceId, trackId = '') => {
    const wrapper = shallowMount(SpotifyPlayer, {
      propsData: {
        token: { token },
        trackId,
      },
    })

    wrapper.setData({
      player: {
        _options: {
          id: deviceId
        },
      }
    })

    return wrapper;
}

describe('SpotifyPlayer', () => {
    it('creates a new Spotify.Player instance', () => {
        const token = 'foo'
        const deviceId = 'bar'

        const spy = jest.spyOn(SpotifyService, 'createPlayer')
            .mockImplementationOnce(() => ({
                on: jest.fn(),
                connect: jest.fn(),
            }))

        shallowMountSpotifyPlayer(token, deviceId)

        window.onSpotifyWebPlaybackSDKReady()

        expect(spy).toHaveBeenCalledWith('My Spotify Player', token)
        spy.mockRestore();
    })

    describe('API Interactions', () => {
        it('can play a track', () => {
            const track = {}
            const token = 'foo'
            const deviceId = 'bar'

            const spy = jest.spyOn(SpotifyService, 'playTrack')
                .mockImplementationOnce(() => Promise.resolve())

            const wrapper = shallowMountSpotifyPlayer(token, deviceId)

            wrapper.vm.playTrack(track);

            expect(spy).toHaveBeenCalledWith(deviceId, track, token)
            spy.mockRestore();
        })

        it('can shuffle tracks with no currentState', () => {
            const token = 'foo'
            const deviceId = 'bar'

            const spy = jest.spyOn(SpotifyService, 'shuffle')
                .mockImplementationOnce(() => Promise.resolve())

            const wrapper = shallowMountSpotifyPlayer(token, deviceId)

            wrapper.vm.shuffle();

            expect(spy).toHaveBeenCalledWith(deviceId, 'true', token)
            spy.mockRestore();
        })

        it('can shuffle tracks with currentState', () => {
            const token = 'foo'
            const deviceId = 'bar'
            const shuffle = true

            const spy = jest.spyOn(SpotifyService, 'shuffle')
                .mockImplementationOnce(() => Promise.resolve())

            const wrapper = shallowMountSpotifyPlayer(token, deviceId)
            wrapper.setData({
                currentState: {
                  shuffle,
                  duration: 0,
                  position: 0,
                  paused: false,
                },
            })

            wrapper.vm.shuffle();

            expect(spy).toHaveBeenCalledWith(deviceId, JSON.stringify(!shuffle), token)
            spy.mockRestore();
        })
    })

})
