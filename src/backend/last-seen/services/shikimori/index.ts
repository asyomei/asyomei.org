import type { LastSeenItem } from '../../types'
import { HOUR } from '~/backend/consts'
import { swr, ttlValidator } from '~/backend/swr'
import { url } from '~/url'
import { fetchShikimori } from './fetch'

const USER_ID = 1461317

export const shikimori = swr<LastSeenItem | undefined>({
  validate: ttlValidator({
    refetch: 3 * HOUR,
    update: 8 * HOUR,
  }),
  async fetcher() {
    const event = await fetchShikimori(USER_ID)
    return event && {
      service: {
        name: 'shikimori',
        url: url.my.profiles.shiki,
      },
      content: {
        text: event.target,
        url: event.url,
      },
      date: event.date,
      suffix: event.description,
    }
  },
})
