export interface LastSeenItem {
  service: { name: string, url: string }
  content: { text: string, url: string }
  date: Date
  suffix?: string
}
