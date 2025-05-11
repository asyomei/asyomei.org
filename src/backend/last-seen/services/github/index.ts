import type { LastSeenItem } from '../../types'
import { HOUR } from '~/backend/consts'
import { swr, ttlValidator } from '~/backend/swr'
import { url } from '~/url'
import { fetchGithub } from './fetch'

export const github = swr<LastSeenItem | undefined>({
  validate: ttlValidator({
    update: 1 * HOUR,
    refetch: 3 * HOUR,
  }),
  async fetcher() {
    const event = await fetchGithub('asyomei')
    return event.description?.at && {
      service: {
        name: 'github',
        url: url.my.profiles.github,
      },
      content: {
        text: event.repo,
        url: event.url,
      },
      date: event.date,
      suffix: event.description,
    }
  },
})
