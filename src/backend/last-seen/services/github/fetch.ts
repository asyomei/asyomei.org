import z from 'zod'
import { waf } from '~/backend/utils/waf'

const API_URL = 'https://api.github.com/users/%s/events/public?per_page=1'

const Event = z.object({
  type: z.string(),
  payload: z.any(),
  repo: z.object({
    name: z.string(),
    url: z.string(),
  }),
  created_at: z.coerce.date(),
})
  .transform(x => ({
    description: getDescription(x.type, x.payload),
    repo: x.repo.name,
    url: new URL(x.repo.url, 'https://github.com').toString(),
    date: x.created_at,
  }))

const ResponseSchema = z.array(Event).nonempty().transform(x => x[0])

export async function fetchGithub(user: string) {
  const url = API_URL.replace('%s', user)
  const resp = await waf(url, {
    headers: { 'X-GitHub-Api-Version': '2022-11-28' },
  })

  return ResponseSchema.parse(await resp.json())
}

function getDescription(type: string, payload: any) {
  const fn = {
    Create: () => `${payload.ref_type} created`,
    Delete: () => `${payload.ref_type} deleted`,
    Fork: () => 'forked',
    Gollum: () => 'wiki updated',
    IssueComment: () => `issue comment ${payload.action}`,
    Issues: () => `issue ${payload.action}`,
    Public: () => 'made public',
    PullRequest: () => `pr ${payload.action}`,
    Push: () => `pushed ${payload.distinct_size} commit${payload.distinct_size === 1 ? '' : 's'}`,
    Release: () => `release ${payload.action}`,
    Watch: () => 'starred',
  }[type.replace('Event', '')]

  return fn?.()
}
