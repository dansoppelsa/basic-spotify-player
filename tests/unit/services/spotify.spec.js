import * as SpotifyService from '@/services/spotify'

const withAdapter = async (axios, token, fn) => {
    const request = jest.fn()
        .mockImplementation(() => Promise.resolve({ data: null }))

    const original = axios.defaults.adapter
    axios.defaults.adapter = request

    const configWith = options => ({
        adapter: request,
        maxContentLength: -1,
        timeout: 0,
        transformRequest: axios.defaults.transformRequest,
        transformResponse: axios.defaults.transformResponse,
        validateStatus: axios.defaults.validateStatus,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        ...options,
    })
    await fn(request, configWith)

    axios.defaults.adapter = original
}

describe('services/spotify', () => {
    const deviceId = 'abc-123'
    const token = 'hash=='

    it('sends a shuffle request', async () => {
        const state = 'true'

        await withAdapter(SpotifyService.api, token, async (req, configWith) => {
            await SpotifyService.shuffle(deviceId, state, token)

            expect(req).toHaveBeenCalledWith(configWith({
                method: 'put',
                baseURL: 'https://api.spotify.com/v1',
                url: 'https://api.spotify.com/v1/me/player/shuffle',
                params: {
                    device_id: deviceId,
                    state,
                },
                data: JSON.stringify({}),
            }))
        });
    });

    it('sends a playTrack request', async () => {
        const track = {}

        await withAdapter(SpotifyService.api, token, async (req, configWith) => {
            await SpotifyService.playTrack(deviceId, track, token)

            expect(req).toHaveBeenCalledWith(configWith({
                method: 'put',
                baseURL: 'https://api.spotify.com/v1',
                url: 'https://api.spotify.com/v1/me/player/play',
                params: {
                    device_id: deviceId,
                },
                data: JSON.stringify({
                    uris: [track],
                }),
            }))
        });
    });

    it('searches for songs', async () => {
        const q = 'foo'
        const type = 'bar'

        await withAdapter(SpotifyService.api, token, async (req, configWith) => {
            await SpotifyService.search(q, type, token)

            expect(req).toHaveBeenCalledWith(configWith({
                method: 'get',
                baseURL: 'https://api.spotify.com/v1',
                url: 'https://api.spotify.com/v1/search',
                params: {
                    q,
                    type,
                },
            }))
        });
    });
})
