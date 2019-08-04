import { shallowMount } from '@vue/test-utils'
import SpotifySearch from '@/components/SpotifySearch.vue'

import * as SpotifyService from '@/services/spotify';

const shallowMountSpotifySearch = (token) => {
    return shallowMount(SpotifySearch, {
      propsData: {
        token,
      },
    })
}

describe('SpotifySearch', () => {
    describe('API Interactions', () => {
        it('searches', () => {
            const token = 'foo'
            const query = 'song'
            const type = 'track'

            const spy = jest.spyOn(SpotifyService, 'search')
                .mockImplementationOnce(() => Promise.resolve({
                    data: { tracks: { items: [] } },
                }))

            const wrapper = shallowMountSpotifySearch(token)

            wrapper.setData({
                query,
                type,
            })

            wrapper.vm.searchSpotify();

            expect(spy).toHaveBeenCalledWith(query, type, token)
            spy.mockRestore();
        })
    })

})
