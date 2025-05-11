import z from 'zod'
import { compact } from '~/backend/utils/compact'
import { waf } from '~/backend/utils/waf'

const API_URL = 'https://ws.audioscrobbler.com/2.0/'

const LastfmTrack = z.object({
  'artist': z.object({ '#text': z.string() }).transform(x => x['#text']),
  'name': z.string(),
  'url': z.url(),
  'date': z.object({ uts: z.coerce.number() }).transform(x => new Date(x.uts * 1000)).optional(),
  '@attr': z.object({ nowplaying: z.literal('true') }).partial().optional(),
})
  .transform(x => compact({
    ...x,
    '@attr': undefined,
    'name': undefined,
    'title': x.name,
    'playing': x['@attr']?.nowplaying === 'true',
  }))

const ResponseSchema = z.object({
  recenttracks: z.object({
    track: z.array(LastfmTrack).nonempty(),
  }),
})
  .transform(x => x.recenttracks.track[0])

export async function fetchLastfm(apiKey: string, user: string) {
  const resp = await waf(API_URL, {
    query: {
      user,
      api_key: apiKey,
      method: 'user.getrecenttracks',
      format: 'json',
      limit: '1',
    },
  })

  return ResponseSchema.parse(await resp.json())
}
