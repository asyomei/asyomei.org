import type { LastSeenItem } from '../../types'
import { HOUR, MINUTE } from '~/backend/consts'
import { LASTFM_API_KEY } from '~/backend/env'
import { swr, ttlValidator } from '~/backend/swr'
import { url } from '~/url'
import { fetchLastfm } from './fetch'

export const lastfm = swr<LastSeenItem | undefined>({
  validate: ttlValidator({
    update: 5 * MINUTE,
    refetch: 1 * HOUR,
  }),
  async fetcher() {
    if (!LASTFM_API_KEY) return

    const track = await fetchLastfm(LASTFM_API_KEY, 'asyomei')

    return {
      service: {
        name: 'lastfm',
        url: url.my.profiles.lastfm,
      },
      content: {
        text: `${track.title} - ${track.artist}`,
        url: track.url,
      },
      date: track.date ?? new Date(),
    }
  },
})
