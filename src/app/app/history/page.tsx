import { getCachedEntries } from "@/lib/data-server"
import { HistoryList } from "./history-list"

export default async function HistoryPage() {
  const entries = await getCachedEntries()
  return <HistoryList entries={entries} />
}
