import { getAllResources } from '@/lib/resources'
import { toSearchRecord } from '@/lib/search'
import SearchModal from './SearchModal'
import SearchTrigger from './SearchTrigger'

/**
 * Server component: builds the search index payload at request time and
 * passes it to the client-side modal. Renders both the Cmd+K trigger button
 * and the modal itself so they share the same records reference.
 */
export default function SearchProvider() {
  const records = getAllResources().map(toSearchRecord)
  return (
    <>
      <SearchTrigger />
      <SearchModal records={records} />
    </>
  )
}
