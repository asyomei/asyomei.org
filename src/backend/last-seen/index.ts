import type { LastSeenItem } from './types'
import { compact } from '~/backend/utils/compact'
import { github } from './services/github'
import { lastfm } from './services/lastfm'
import { shikimori } from './services/shikimori'

export async function fetchLastSeen(): Promise<LastSeenItem[]> {
  const data = await Promise.all([
    github(),
    lastfm(),
    shikimori(),
  ])

  return compact(data).sort(byDate)
}

function byDate(a: LastSeenItem, b: LastSeenItem) {
  return b.date.getTime() - a.date.getTime()
}
