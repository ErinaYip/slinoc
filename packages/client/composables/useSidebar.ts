import { computed } from 'vue'
import { breakpoints } from '../state'
import { useNav } from './useNav'

/**
 * Shared logic for the left sidebar that lists the topics of every slide.
 *
 * The sidebar is only meaningful in play mode, and is hidden on small
 * screens, in embedded mode and in print/export mode.
 */
export function useSidebar() {
  const { isEmbedded, isPlaying, isPrintMode } = useNav()
  const md = breakpoints.smaller('md')

  const isSidebarVisible = computed(() => (
    isPlaying.value
    && !isEmbedded.value
    && !isPrintMode.value
    && !md.value
  ))

  return {
    isSidebarVisible,
  }
}
