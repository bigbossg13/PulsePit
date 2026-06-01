import { getAllResources } from '@/lib/resources'
import { toSearchRecord } from '@/lib/search'
import SearchModal from './SearchModal'

export default function SearchProvider() {
  const records = getAllResources().map(toSearchRecord)
  return <SearchModal records={records} />
}
